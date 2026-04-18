async function renderResult() {
    // 1. 从本地存储获取结果码
    const code = localStorage.getItem('user_weather_code') || "00000";
    
    // 2. 加载你那两个 JSON 文件
    const resComponents = await fetch('./data/dimension_components.json');
    const components = await resComponents.json();
    
    const resResults = await fetch('./data/weather_results.json');
    const results = await resResults.json();

    // 3. 填充栏目 1 (标题) 和 栏目 3 (一句话描述)
    document.getElementById('result-title').innerText = results[code].title;
    document.getElementById('result-quote').innerText = results[code].quote;

    // 4. 填充栏目 4 (深度解析 - 5段拼接)
    const dimKeys = ['TEMP', 'HUM', 'VIS', 'WIND', 'ION'];
    let detailHTML = "";
    
    dimKeys.forEach((dim, index) => {
        const bit = code[index]; // 获取对应位的 0 或 1
        const text = components[dim][bit]; // 抓取对应的解析段落
        detailHTML += `<p class="dimension-detail">${text}</p>`;
    });
    
    document.getElementById('result-detail-container').innerHTML = detailHTML;

    // 5. 设置背景图 (假设你已经把图片按代码命名放好了)
    document.body.style.backgroundImage = `url('./assets/images/bg/${code}.jpg')`;
}

// 页面加载完成后执行
window.onload = renderResult;