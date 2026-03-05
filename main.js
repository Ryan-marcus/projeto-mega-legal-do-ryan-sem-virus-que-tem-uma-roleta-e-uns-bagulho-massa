const newTaskInput = document.getElementById('new-task');
const addButton = document.getElementById('add-button');
const taskList = document.getElementById('task-list');
const deletedList = document.getElementById('deleted-list');
const gifButton = document.getElementById('gif-button');
const randomGifImg = document.getElementById('random-gif');

// Audio handling
const backgroundAudio = document.getElementById('background-audio');
let audioPlayed = false;

// helper to start playback when we know the user interacted
function tryPlayAudio() {
    // only attempt once unless it fails
    if (audioPlayed) return;
    backgroundAudio.play()
        .then(() => {
            audioPlayed = true;
            console.log('background audio started');
        })
        .catch(error => {
            // if the play request is rejected (autoplay blocked) we
            // keep audioPlayed=false so another user gesture can retry
            console.warn('Audio play failed:', error);
        });
}

// most mobile/desktop browsers require a user gesture to begin
// playback; listen for a click anywhere and try again until success
document.addEventListener('click', tryPlayAudio);

document.addEventListener('keydown', tryPlayAudio);


// keep the last 3 deleted tasks as objects {text,date,duration}
const lastDeleted = [];

// list of random gifs
const gifUrls = [
    'https://media2.giphy.com/media/v1.Y2lkPTc5MGI3NjExNHlqZm9tc283eWx4eHlwY2VrcGtzMThnczI4cHZmcW1zdW9pMWx5MCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/LozTbKEFoXAcheLzjw/giphy.gif',
    'https://media4.giphy.com/media/v1.Y2lkPTc5MGI3NjExb3NxZG5nM2s3eTZqMHJtbXBxZWNpemZzMjNvYzNqeWhiYzJxdGx6ayZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/Kx8fDMyo1Nie5cRIdh/giphy.gif',
    'https://media2.giphy.com/media/v1.Y2lkPTc5MGI3NjExYmF2anV2eGIxd3JmZG01ZmNyajFpNjlsNGg2aHBlaDNjbGFqeWNuOSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/cGis3G6pdGfweqkTG5/giphy.gif',
    'https://media1.giphy.com/media/v1.Y2lkPTc5MGI3NjExNjJlYnA0bjJ2OXBnZXd3cXQ1ZjN0c2FuNnFnZWF5ZWw4Z3FuamNidiZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/0XfxJweNzNANim7tqq/giphy.gif',
    'https://media1.giphy.com/media/v1.Y2lkPTc5MGI3NjExYTg5OGh2czE4dXN4aDN1cGtkdWJyMWF0Mm9jeGtnNmdxb3ZtbXNzZyZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/Lamxo1weJvTlNp8CR0/giphy.gif',
    'https://media0.giphy.com/media/v1.Y2lkPTc5MGI3NjExNHhlNjdzOHpwbmhyaXZiaXh1eWZwNWFsdG93Y3FzZjB3cDBreXltZSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/OKyTMroU0kaYEaTDNU/giphy.gif',
    'https://media2.giphy.com/media/v1.Y2lkPTc5MGI3NjExdWhrZm10bDI0aHRqOWhqdzcxanhvZWpyeTFkYjdidWhkcWgzN2dydSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/QvFlhC7gakok7iPDwQ/giphy.gif',
    'https://media.giphy.com/media/v1.Y2lkPWVjZjA1ZTQ3MGR0ZWs0cXltcGRjY2I5MDg1cGcxcjJ0eHh0NjZuZnUyMnpndjhlNCZlcD12MV9naWZzX3JlbGF0ZWQmY3Q9Zw/oaNt6gq5ZVoxzp7Y1G/giphy.gif',
    'https://media3.giphy.com/media/v1.Y2lkPTc5MGI3NjExOHBoMWM2ZzVqYjJvM2xyYW41eW1ocWZqcWxnYnlwYzA5MWkwNmFsYiZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/t20oQnyuOFjEGhNHI4/giphy.gif',
    'https://media0.giphy.com/media/v1.Y2lkPTc5MGI3NjExOWRiZGV0dnM0dWR3OXRqNnhsd2lvdXh2NHBsNGF3dTV2Y2I2OGFueCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/2ARMmLelTNIz2lft2w/giphy.gif',
    'https://media2.giphy.com/media/v1.Y2lkPTc5MGI3NjExNmg1MThvYTgzeXExc3JzamthdDRhZjByNWNzZnA2cmNoZzJudjB3OCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/cAi0jErQPoh24Lam7B/giphy.gif',

];

function createTaskItem(text, date, duration) {
    const li = document.createElement('li');
    // container for text and metadata
    const content = document.createElement('div');
    content.className = 'task-content';
    content.textContent = text;

    if (date) {
        const spanDate = document.createElement('span');
        spanDate.className = 'task-date';
        spanDate.textContent = ` 📅 ${date}`;
        content.appendChild(spanDate);
    }
    if (duration) {
        const spanDur = document.createElement('span');
        spanDur.className = 'task-duration';
        spanDur.textContent = ` ⏱ ${duration}`;
        content.appendChild(spanDur);
    }
    li.appendChild(content);

    // store data for potential restore
    li.dataset.text = text;
    li.dataset.date = date;
    li.dataset.duration = duration;

    // click to toggle completed
    li.addEventListener('click', () => {
        li.classList.toggle('completed');
    });

    // remove button
    const removeBtn = document.createElement('button');
    removeBtn.textContent = '✕';
    removeBtn.className = 'remove-btn';
    removeBtn.addEventListener('click', (e) => {
        e.stopPropagation(); // prevent li click
        taskList.removeChild(li);
        // record deletion object and trim array
        lastDeleted.unshift({
            text: li.dataset.text,
            date: li.dataset.date,
            duration: li.dataset.duration
        });
        if (lastDeleted.length > 3) lastDeleted.pop();
        refreshDeletedList();
    });

    li.appendChild(removeBtn);
    return li;
}

function addTask() {
    const text = newTaskInput.value.trim();
    const date = document.getElementById('task-date').value;
    const duration = document.getElementById('task-duration').value;
    if (text === '') return;

    const item = createTaskItem(text, date, duration);
    taskList.appendChild(item);
    newTaskInput.value = '';
    document.getElementById('task-date').value = '';
    document.getElementById('task-duration').value = '';
    newTaskInput.focus();
}

addButton.addEventListener('click', addTask);
newTaskInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') addTask();
});

// generate random gif when button is clicked
gifButton.addEventListener('click', () => {
    const idx = Math.floor(Math.random() * gifUrls.length);
    const randomGifUrl = gifUrls[idx];
    randomGifImg.src = randomGifUrl;
    document.getElementById('dancing-lizard').src = gifUrls[Math.floor(Math.random() * gifUrls.length)];
    document.getElementById('Bob').src = gifUrls[Math.floor(Math.random() * gifUrls.length)];
});

function refreshDeletedList() {
    deletedList.innerHTML = '';
    lastDeleted.forEach((item, index) => {
        const li = document.createElement('li');
        li.textContent = item.text + (item.date ? ` 📅 ${item.date}` : '') + (item.duration ? ` ⏱ ${item.duration}` : '');
        const restoreBtn = document.createElement('button');
        restoreBtn.textContent = '↩';
        restoreBtn.title = 'Restaurar';
        restoreBtn.addEventListener('click', () => {
            restoreTask(index);
        });
        li.appendChild(restoreBtn);
        deletedList.appendChild(li);
    });
}

function restoreTask(idx) {
    const obj = lastDeleted.splice(idx, 1)[0];
    refreshDeletedList();
    addTaskToList(obj.text, obj.date, obj.duration);
}

function addTaskToList(text, date, duration) {
    const item = createTaskItem(text, date, duration);
    taskList.appendChild(item);
}

// ===== ROLETA =====
const spinnerCanvas = document.getElementById('spinner-canvas');
const spinnerInput = document.getElementById('spinner-input');
const spinnerAddBtn = document.getElementById('spinner-add-btn');
const spinnerItemsDiv = document.getElementById('spinner-items');
const spinnerResultDiv = document.getElementById('spinner-result');
const ctx = spinnerCanvas.getContext('2d');

let spinnerOptions = ['Opção 1', 'Opção 2', 'Opção 3'];
let isSpinning = false;
let spinnerRotation = 0;

const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E2'];

function drawSpinner() {
    const centerX = spinnerCanvas.width / 2;
    const centerY = spinnerCanvas.height / 2;
    const radius = 140;
    const sliceAngle = (Math.PI * 2) / spinnerOptions.length;

    ctx.clearRect(0, 0, spinnerCanvas.width, spinnerCanvas.height);
    ctx.save();
    ctx.translate(centerX, centerY);
    ctx.rotate(spinnerRotation);

    spinnerOptions.forEach((option, i) => {
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.arc(0, 0, radius, i * sliceAngle, (i + 1) * sliceAngle);
        ctx.closePath();
        ctx.fillStyle = colors[i % colors.length];
        ctx.fill();
        ctx.strokeStyle = '#121212';
        ctx.lineWidth = 2;
        ctx.stroke();

        // draw text
        ctx.save();
        ctx.rotate(i * sliceAngle + sliceAngle / 2);
        ctx.textAlign = 'right';
        ctx.fillStyle = '#000';
        ctx.font = 'bold 14px Arial';
        ctx.fillText(option, radius - 20, 5);
        ctx.restore();
    });

    ctx.restore();

    // center circle
    ctx.beginPath();
    ctx.arc(centerX, centerY, 15, 0, Math.PI * 2);
    ctx.fillStyle = '#FFD700';
    ctx.fill();
    ctx.strokeStyle = '#121212';
    ctx.lineWidth = 2;
    ctx.stroke();
}

function spin() {
    if (isSpinning || spinnerOptions.length === 0) return;
    isSpinning = true;
    spinnerResultDiv.textContent = '';

    const spins = 5 + Math.random() * 5;
    const randomAngle = Math.random() * Math.PI * 2;
    const targetRotation = spinnerRotation + spins * Math.PI * 2 + randomAngle;

    let startTime = Date.now();
    const duration = 3000;

    function animate() {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const easeOut = 1 - Math.pow(1 - progress, 3);
        spinnerRotation = spinnerRotation + (targetRotation - spinnerRotation) * easeOut;

        drawSpinner();

        if (progress < 1) {
            requestAnimationFrame(animate);
        } else {
            isSpinning = false;
            const winningIndex = Math.floor((spinnerOptions.length - (spinnerRotation % (Math.PI * 2)) / (Math.PI * 2 / spinnerOptions.length)) % spinnerOptions.length);
            spinnerResultDiv.textContent = `Vencedor: ${spinnerOptions[winningIndex]}`;
        }
    }
    animate();
}

function addSpinnerOption() {
    const value = spinnerInput.value.trim();
    if (value === '') return;
    spinnerOptions.push(value);
    spinnerInput.value = '';
    updateSpinnerDisplay();
    drawSpinner();
}

function removeSpinnerOption(index) {
    spinnerOptions.splice(index, 1);
    if (spinnerOptions.length === 0) {
        spinnerOptions = ['Opção 1'];
    }
    updateSpinnerDisplay();
    drawSpinner();
}

function updateSpinnerDisplay() {
    spinnerItemsDiv.innerHTML = '';
    spinnerOptions.forEach((opt, i) => {
        const span = document.createElement('span');
        span.textContent = opt;
        const btn = document.createElement('button');
        btn.textContent = '✗';
        btn.addEventListener('click', () => removeSpinnerOption(i));
        span.appendChild(btn);
        spinnerItemsDiv.appendChild(span);
    });
}

spinnerAddBtn.addEventListener('click', addSpinnerOption);
spinnerInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') addSpinnerOption();
});

spinnerCanvas.addEventListener('click', spin);

// initial draw
drawSpinner();

// ===== DINO GAME =====
const dinoGame = document.getElementById('dino-game');
const dino = document.getElementById('dino');
const dinoScore = document.getElementById('dino-score');
const dinoGameOver = document.getElementById('dino-game-over');

let isJumping = false;
let gameActive = true;
let score = 0;
let velocity = 0;
let dinoBottom = 20;

const gravity = 0.6;
const jumpPower = 12;

function updateDino() {
    if (isJumping) {
        velocity -= gravity;
        dinoBottom += velocity;

        if (dinoBottom <= 20) {
            dinoBottom = 20;
            isJumping = false;
            velocity = 0;
        }
    }
    dino.style.bottom = dinoBottom + 'px';
}

function jump() {
    if (!isJumping && gameActive) {
        isJumping = true;
        velocity = jumpPower;
    }
}

function createCacto() {
    if (!gameActive) return;

    const cacto = document.createElement('div');
    cacto.className = 'cacto';
    cacto.style.right = '-30px';
    dinoGame.appendChild(cacto);

    let cactoLeft = dinoGame.offsetWidth;

    const cactoInterval = setInterval(() => {
        cactoLeft -= 5;
        cacto.style.right = (dinoGame.offsetWidth - cactoLeft) + 'px';

        // Colisão AABB (Axis-Aligned Bounding Box)
        // Dino: [20, 60] x [dinoBottom, dinoBottom+40]
        // Cacto: [cactoLeft, cactoLeft+40] x [20, 60]
        if (cactoLeft < 60 &&
            cactoLeft + 40 > 20 &&
            20 < dinoBottom + 40 &&
            60 > dinoBottom) {
            clearInterval(cactoInterval);
            endGame();
        }

        if (cactoLeft < -30) {
            clearInterval(cactoInterval);
            cacto.remove();
            if (gameActive) {
                score += 10;
                dinoScore.textContent = `Pontos: ${score}`;
            }
        }
    }, 30);
}

function endGame() {
    gameActive = false;
    dinoGameOver.style.display = 'block';
}

function resetGame() {
    gameActive = true;
    score = 0;
    dinoBottom = 20;
    isJumping = false;
    velocity = 0;
    dinoScore.textContent = 'Pontos: 0';
    dinoGameOver.style.display = 'none';
    dino.style.bottom = '20px';

    // Remover cactos antigos
    const cactos = document.querySelectorAll('.cacto');
    cactos.forEach(c => c.remove());
}

// Controles
document.addEventListener('keydown', (e) => {
    if (e.code === 'Space') {
        jump();
        e.preventDefault();
    }
});

dinoGame.addEventListener('click', () => {
    if (!gameActive) {
        resetGame();
        startGame();
    } else {
        jump();
    }
});

// Loop de animação
setInterval(updateDino, 30);

function startGame() {
    // Gerar obstáculos a cada tempo variável
    const spawnCacto = setInterval(() => {
        if (gameActive) {
            createCacto();
        } else {
            clearInterval(spawnCacto);
        }
    }, 2000);
}

// Iniciar o jogo
startGame();
