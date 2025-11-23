CREATE TABLE IF NOT EXISTS sensor_data (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    deviceId TEXT NOT NULL,
    timestamp INTEGER NOT NULL,
    payload TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_data_device ON sensor_data(deviceId);

CREATE INDEX IF NOT EXISTS idx_data_timestamp ON sensor_data(timestamp);