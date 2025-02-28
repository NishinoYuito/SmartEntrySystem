-- QRコードの有効期限日のカラムを追加 (来社日 + 1)
ALTER TABLE public.visitors
ADD COLUMN expire_date TIMESTAMP WITH TIME ZONE
  GENERATED ALWAYS AS (visit_data::timestamp + INTERVAL '1 day') STORED;