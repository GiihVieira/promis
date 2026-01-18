ALTER TABLE prescription_items
ADD COLUMN posology TEXT;

ALTER TABLE prescription_items DROP COLUMN dosage;
ALTER TABLE prescription_items DROP COLUMN frequency;
ALTER TABLE prescription_items DROP COLUMN duration;
