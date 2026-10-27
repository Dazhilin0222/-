import {test,expect} from '@playwright/test';
test('conversion, candidates, clipboard, clear, and safe rendering',async({page,context})=>{
 await context.grantPermissions(['clipboard-read','clipboard-write']);
 await page.goto('/');await expect(page.locator('#convert')).toBeEnabled();
 await page.getByRole('button',{name:'su3cl3'}).click();
 await expect(page.locator('.candidate-text').first()).toHaveText('你好');
 await expect(page.locator('.candidate')).toHaveCount(6);
 await page.getByRole('button',{name:'複製候選 1',exact:true}).click();
 expect(await page.evaluate(()=>navigator.clipboard.readText())).toBe('你好');
 await page.evaluate(()=>navigator.clipboard.writeText('vu,4vu,4'));
 await page.locator('#paste').click();await page.locator('#convert').click();
 await expect(page.locator('.candidate-text').first()).toHaveText('謝謝');
 await page.getByRole('button',{name:'ji394su3'}).click();
 await expect(page.locator('.candidate-text').first()).toHaveText('我愛你');
 await page.locator('#clear').click();await expect(page.locator('#input')).toHaveValue('');
 await expect(page.locator('#count')).toHaveText('0 / 300');
 await page.locator('#input').fill('<img src=x onerror=alert(1)>');await page.locator('#convert').click();
 await expect(page.locator('#results img')).toHaveCount(0);
});
test('mobile fits screen and keyboard reference opens',async({page})=>{
 await page.setViewportSize({width:390,height:844});await page.goto('/');await expect(page.locator('#convert')).toBeEnabled();
 await page.getByRole('button',{name:'su3cl3'}).click();await expect(page.locator('.candidate-text').first()).toHaveText('你好');
 expect(await page.evaluate(()=>document.documentElement.scrollWidth)).toBeLessThanOrEqual(390);
 await page.locator('summary').click();await expect(page.locator('#keymap')).toBeVisible();
 await page.screenshot({path:'/tmp/zhuyin-mobile.png',fullPage:true});
});
test('clipboard denial gives manual paste guidance',async({page})=>{
 await page.goto('/');await page.evaluate(()=>{Object.defineProperty(navigator,'clipboard',{value:{readText:()=>Promise.reject(new Error('denied'))}});});
 await page.locator('#paste').click();await expect(page.locator('#toast')).toContainText('Ctrl / ⌘ + V');
});
test('dictionary failure presents retry and keeps phonetic preview',async({page})=>{
 await page.route('**/dictionary.json',r=>r.abort());await page.goto('/');await expect(page.locator('#convert')).toHaveText('重新載入詞庫');
 await page.locator('#input').fill('su3');await expect(page.locator('#phonetic')).toHaveText('ㄋㄧˇ');
});
