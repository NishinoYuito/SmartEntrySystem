-- ① テーブル作成 (訪問者テーブル)
CREATE TABLE public.visitors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  visitor_name VARCHAR(100) NOT NULL,
  company_name VARCHAR(255),
  visitor_email VARCHAR(255) NOT NULL,
  visit_data DATE NOT NULL,
  visit_purpose INT NOT NULL CHECK (
    visit_purpose IN (1, 2, 3, 4)
  ),
  visit_purpose_detail VARCHAR(255),
  visit_amount INT NOT NULL DEFAULT 1,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- `updated_at` を更新するトリガー関数を作成
CREATE FUNCTION update_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = timezone('Asia/Tokyo', now());
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- `updated_at` を自動更新するトリガーを追加
CREATE TRIGGER set_timestamp
BEFORE UPDATE ON public.visitors
FOR EACH ROW
EXECUTE FUNCTION update_timestamp();

-- ② RLS（行レベルセキュリティ）を無効にする
ALTER TABLE public.visitors DISABLE ROW LEVEL SECURITY;

-- ③ 各ロールに全ての権限を付与する
GRANT ALL ON TABLE public.visitors TO anon;