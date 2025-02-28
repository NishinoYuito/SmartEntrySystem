-- ① テーブル作成 (同行者テーブル)
CREATE TABLE public.companions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  visitor_id UUID NOT NULL,
  entry_id UUID,
  companion_name VARCHAR(100) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  CONSTRAINT fk_companions_visitor FOREIGN KEY (visitor_id) REFERENCES public.visitors(id),
  CONSTRAINT fk_companions_entry FOREIGN KEY (entry_id) REFERENCES public.entry_records(id)
);

-- `updated_at` を更新するトリガー関数を作成
CREATE OR REPLACE FUNCTION update_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = timezone('Asia/Tokyo', now());
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- `updated_at` を自動更新するトリガーを追加
CREATE TRIGGER set_timestamp
BEFORE UPDATE ON public.companions
FOR EACH ROW
EXECUTE FUNCTION update_timestamp();

-- ② RLS（行レベルセキュリティ）を無効にする
ALTER TABLE public.visitors DISABLE ROW LEVEL SECURITY;

-- ③ 各ロールに全ての権限を付与する
GRANT ALL ON TABLE public.visitors TO anon;