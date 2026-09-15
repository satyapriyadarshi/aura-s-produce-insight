CREATE POLICY "Farmers upload own produce images" ON storage.objects
  FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'produce' AND (storage.foldername(name))[1] = auth.uid()::text);

CREATE POLICY "Farmers read own produce images" ON storage.objects
  FOR SELECT TO authenticated
  USING (bucket_id = 'produce' AND (storage.foldername(name))[1] = auth.uid()::text);

CREATE POLICY "Farmers delete own produce images" ON storage.objects
  FOR DELETE TO authenticated
  USING (bucket_id = 'produce' AND (storage.foldername(name))[1] = auth.uid()::text);