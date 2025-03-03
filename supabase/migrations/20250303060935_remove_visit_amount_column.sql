-- visit_amount カラムを削除
ALTER TABLE public.visitors
DROP COLUMN IF EXISTS visit_amount;