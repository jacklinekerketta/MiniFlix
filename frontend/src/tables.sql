-- Create Database
CREATE DATABASE IF NOT EXISTS miniflix;
USE miniflix;


-- =========================
-- 1️⃣ USERS TABLE
-- =========================
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255),
    email VARCHAR(255) UNIQUE,
    password_hash VARCHAR(255),
    oauth_provider VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


-- =========================
-- 2️⃣ VIDEOS TABLE
-- =========================
CREATE TABLE videos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255),
    description TEXT,
    thumbnail_url TEXT,
    banner_url TEXT,
    hls_manifest_url TEXT,
    duration VARCHAR(50),
    category VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


-- =========================
-- 3️⃣ TAGS TABLE
-- =========================
CREATE TABLE tags (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) UNIQUE
);


-- =========================
-- 4️⃣ VIDEO_TAGS (M-M RELATION)
-- =========================
CREATE TABLE video_tags (
    id INT AUTO_INCREMENT PRIMARY KEY,
    video_id INT,
    tag_id INT,

    FOREIGN KEY (video_id) 
        REFERENCES videos(id)
        ON DELETE CASCADE,

    FOREIGN KEY (tag_id) 
        REFERENCES tags(id)
        ON DELETE CASCADE
);
