-- phpMyAdmin で実行してください
CREATE TABLE IF NOT EXISTS clicks (
  id    INT AUTO_INCREMENT PRIMARY KEY,
  app   VARCHAR(255) NOT NULL,
  ts    BIGINT       NOT NULL,
  label VARCHAR(100) NOT NULL,
  INDEX idx_app (app),
  INDEX idx_ts  (ts)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
