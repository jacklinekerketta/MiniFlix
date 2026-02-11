import { db } from "../config/db.js";

// ➕ Add Video
export const addVideo = (req, res) => {
  const {
    title,
    description,
    thumbnail_url,
    hls_manifest_url,
    tags,
  } = req.body;

  db.query(
    "INSERT INTO videos (title, description, thumbnail_url, hls_manifest_url) VALUES (?,?,?,?)",
    [title, description, thumbnail_url, hls_manifest_url],
    (err, result) => {
      if (err) return res.status(500).json(err);

      const videoId = result.insertId;

      // Insert tags
      tags.forEach((tag) => {
        db.query(
          "INSERT IGNORE INTO tags (name) VALUES (?)",
          [tag]
        );

        db.query(
          `INSERT INTO video_tags (video_id, tag_id)
           SELECT ?, id FROM tags WHERE name=?`,
          [videoId, tag]
        );
      });

      res.json({ message: "Video added" });
    }
  );
};

// Public listings / metadata – DO NOT leak the internal manifest URL.
export const getVideos = (req, res) => {
  db.query(
    `SELECT v.*, 
     GROUP_CONCAT(t.name) as tags
     FROM videos v
     LEFT JOIN video_tags vt ON v.id = vt.video_id
     LEFT JOIN tags t ON vt.tag_id = t.id
     GROUP BY v.id`,
    (err, results) => {
      if (err) return res.status(500).json(err);

      const safeResults = results.map((row) => {
        // Strip the manifest URL before sending to the client
        const { hls_manifest_url, ...rest } = row;
        return rest;
      });

      res.json(safeResults);
    }
  );
};

export const getVideoById = (req, res) => {
  const { id } = req.params;

  db.query(
    `SELECT v.*, 
     GROUP_CONCAT(t.name) as tags
     FROM videos v
     LEFT JOIN video_tags vt ON v.id = vt.video_id
     LEFT JOIN tags t ON vt.tag_id = t.id
     WHERE v.id=?
     GROUP BY v.id`,
    [id],
    (err, results) => {
      if (err) return res.status(500).json(err);
      if (!results || results.length === 0)
        return res.status(404).json("Video not found");

      const { hls_manifest_url, ...rest } =
        results[0];

      res.json(rest);
    }
  );
};

export const searchVideos = (req, res) => {
  const { q } = req.query;

  db.query(
    `SELECT * FROM videos 
     WHERE LOWER(title) LIKE LOWER(?)`,
    [`%${q}%`],
    (err, results) => {
      if (err) return res.status(500).json(err);

      const safeResults = results.map((row) => {
        const { hls_manifest_url, ...rest } = row;
        return rest;
      });

      res.json(safeResults);
    }
  );
};

export const filterByTags = (req, res) => {
  const { tags } = req.query; // ?tags=Comedy,2024

  const tagArray = tags.split(",");

  db.query(
    `SELECT v.*
     FROM videos v
     JOIN video_tags vt ON v.id = vt.video_id
     JOIN tags t ON vt.tag_id = t.id
     WHERE t.name IN (?)
     GROUP BY v.id`,
    [tagArray],
    (err, results) => {
      if (err) return res.status(500).json(err);

      const safeResults = results.map((row) => {
        const { hls_manifest_url, ...rest } = row;
        return rest;
      });

      res.json(safeResults);
    }
  );
};

// 🔒 Protected: fetch the HLS manifest URL for streaming.
// This is the endpoint the player will call before starting playback.
export const getManifestById = (req, res) => {
  const { id } = req.params;

  db.query(
    "SELECT hls_manifest_url FROM videos WHERE id = ?",
    [id],
    (err, results) => {
      if (err) return res.status(500).json(err);
      if (!results || results.length === 0)
        return res.status(404).json("Video not found");

      const manifestUrl =
        results[0].hls_manifest_url;

      if (!manifestUrl)
        return res
          .status(404)
          .json("No manifest for this video");

      res.json({ manifestUrl });
    }
  );
};
