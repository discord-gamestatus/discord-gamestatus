-- Don't allow non-urls in image fields
UPDATE statuses SET image=NULL WHERE (image NOT LIKE 'http://%') AND (image NOT LIKE 'https://%');
UPDATE statuses SET offline_image=NULL WHERE (offline_image NOT LIKE 'http://%') AND (offline_image NOT LIKE 'https://%');

ALTER TABLE statuses ADD CONSTRAINT rule_image_url CHECK (image LIKE 'http://%' OR image LIKE 'https://%');
ALTER TABLE statuses ADD CONSTRAINT rule_offline_image_url CHECK (offline_image LIKE 'http://%' OR offline_image LIKE 'https://%');
