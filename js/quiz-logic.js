// 1. 初始化数据
let currentIndex = 0;
let scores = { TEMP: 0, HUM: 0, VIS: 0, WIND: 0, ION: 0 };
let allQuestions = [];

// 2. 加载题目
async function loadQuestions() {
    try {
        const response = await fetch('data/questions.json');
        allQuestions = await response.json();
        showQuestion();
    } catch (error) {
        console.error("加载题目失败，请检查JSON格式:", error);
        document.getElementById('question-text').innerText = "题目加载失败，请检查控制台报错。";
    }
}

// 3. 渲染题目到页面
function showQuestion() {
    if (!allQuestions[currentIndex]) return;
    
    const q = allQuestions[currentIndex];
    
    // 更新进度条 (百分比)
    const progress = ((currentIndex + 1) / allQuestions.length) * 100;
    document.getElementById('progress-fill').style.width = `${progress}%`;
    
    // 更新进度文字 (例如: 1 / 20)
    // 确保你的 HTML 里有 id="current-step" 和 id="total-steps"
    const currentStepEl = document.getElementById('current-step');
    if (currentStepEl) {
        currentStepEl.innerText = currentIndex + 1;
    }
    const totalStepsEl = document.getElementById('total-steps');
    if (totalStepsEl) {
        totalStepsEl.innerText = allQuestions.length;
    }
    
    // 更新题目文字
    document.getElementById('question-text').innerText = q.text;
    
    // 生成选项按钮
    const optionsContainer = document.getElementById('options-container');
    optionsContainer.innerHTML = '';
    
    const labels = ['A', 'B', 'C', 'D'];
    q.options.forEach((opt, index) => {
        const btn = document.createElement('button');
        btn.className = 'option-btn';
        // 渲染 A B C D 标签 + 文字
        btn.innerHTML = `<span class="opt-label">${labels[index]}</span> ${opt.text}`;
        btn.onclick = () => handleSelect(opt.score, q.dimension);
        optionsContainer.appendChild(btn);
    });
}

// 4. 处理选择
function handleSelect(score, dimension) {
    scores[dimension] += score;
    
    if (currentIndex < allQuestions.length - 1) {
        currentIndex++;
        showQuestion();
    } else {
        finishQuiz();
    }
}

// 5. 结束并跳转
function finishQuiz() {
    const dims = ["TEMP", "HUM", "VIS", "WIND", "ION"];
    // 生成 01010 这种编码
    const code = dims.map(d => (scores[d] >= 0 ? "1" : "0")).join("");
    
    // 把原始分数存入 localStorage，防止 URL 过长被截断，也方便读取
    localStorage.setItem('quizScores', JSON.stringify(scores));
    
    // 跳转
    window.location.href = `result.html?code=${code}`;
}

loadQuestions();