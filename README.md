# 切回來 — 注音輸入救援

把忘記切換輸入法時輸入的英文按鍵，還原成注音及多個繁體中文候選。支援台灣標準注音鍵盤、聲調、剪貼簿貼上、逐筆複製、清空、鍵位對照與手機版面。最多 300 個字元，每次提供最多六個候選。

## 開發與驗證

需要 Node.js 22+ 與 npm，不需要後端、API 金鑰或資料庫。

```sh
cd /workspace/-
npm ci --cache /tmp/npm-cache
npm run dev -- --port 5173
```

```sh
npm test
npm run build
npm run test:e2e
```

端對端測試使用環境內 `/usr/bin/chromium`。其他機器可在 `playwright.config.js` 調整 executablePath，或使用 Playwright 安裝的瀏覽器。

`npm run preview -- --port 4173` 可驗證建置輸出。部署時將 `dist/` 放到任意靜態網站服務；剪貼簿 API 需要 HTTPS 或瀏覽器認可的安全環境。剪貼簿遭拒時介面提供手動貼上的提示。

## 操作範例

- `su3cl3` → 你好
- `vu,4vu,4` → 謝謝
- `ji394su3` → 我愛你
- 一聲使用空白鍵；二、三、四、輕聲分別使用 `6`、`3`、`4`、`7`。最後一個一聲音節可省略空白鍵。
- Ctrl / Command + Enter 也可執行轉換。

## 轉換與隱私

詞庫與詞頻由本站靜態載入，文字轉換在瀏覽器內執行，沒有文字上傳、分析追蹤或本機持久儲存。演算法以詞庫、詞頻與有限寬度搜尋排序，不是理解語意的模型；同音字可能不符合語境，請自行挑選或編輯。無法辨識的片段會保留並標註。英文字母與注音鍵位有歧義，不支援自動辨識混合英文或其他鍵盤配置。

## 詞庫與授權

`public/dictionary.json` 是 Rime Terra Pinyin 的鍵位轉換版本（92,510 筆，CC BY-SA 3.0）。另以原樣保留的 Rime Essay `public/essay.txt`（LGPL 3.0）提供詞頻。來源、修改說明及授權在 `public/DICTIONARY-LICENSE.txt`，相關 LGPL/GPL 授權文字亦附於 public。

詞庫已隨專案提供，日常安裝不需要 Python 或重新下載。若要重新產生鍵位字典，下載 Rime Terra Pinyin 原始字典，安裝 `pypinyin==0.55.0` 後執行：

```sh
python scripts/build_dictionary.py /path/to/terra_pinyin.dict.yaml
```

## GitHub Pages 部署

已提供可直接發布的 `docs/` 建置內容（含 `.nojekyll`）。GitHub Settings → Pages 選擇 `Deploy from a branch`、分支 `main`、資料夾 `/docs` 並儲存。

後續修改網站後，執行 `npm run build -- --outDir docs`、保留 `docs/.nojekyll`，並提交新的 docs 內容。Vite 使用相對資源路徑，支援 GitHub Pages 儲存庫子路徑。
