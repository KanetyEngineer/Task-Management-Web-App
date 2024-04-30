// script.js

// ページ読み込み時に保存されたタスク情報をロードする
document.addEventListener('DOMContentLoaded', function() {
    loadTasks();
});

const taskList = document.getElementById('taskList');

function addTask() {
    const taskNameInput = document.getElementById('taskName');
    const taskContentInput = document.getElementById('taskContent');
    const subjectTagInput = document.getElementById('subjectTag');
    const progressSelect = document.getElementById('progress');
    const dueDateInput = document.getElementById('dueDate');

    const taskName = taskNameInput.value;
    const taskContent = taskContentInput.value;
    const subjectTag = subjectTagInput.value;
    const progress = progressSelect.value;
    const dueDate = dueDateInput.value;

    if (!taskName || !taskContent || !subjectTag || !progress || !dueDate) {
        alert("全ての項目を入力してください");
        return;
    }

    const task = document.createElement('div');
    task.classList.add('task');
    
    const taskHeader = document.createElement('h3');
    taskHeader.textContent = taskName;

    const contentParagraph = document.createElement('p');
    contentParagraph.textContent = `内容: ${taskContent}`;

    const tags = document.createElement('div');
    tags.classList.add('tags');
    tags.textContent = `教科: ${subjectTag}`;

    const progressBar = document.createElement('div');
    progressBar.classList.add('progress-bar');
    const progressIndicator = document.createElement('div');
    progressIndicator.classList.add('progress');
    progressIndicator.style.width = `${progress}%`;
    progressBar.appendChild(progressIndicator);

    const dueDateText = document.createElement('p');
    dueDateText.textContent = `期限: ${dueDate}`;

    const deleteButton = document.createElement('button');
    deleteButton.textContent = '削除';
    deleteButton.addEventListener('click', function() {
        task.remove();
        saveTasks(); // タスク削除後にローカルストレージに保存
    });

    // 期限チェックと背景色の設定
    const today = new Date();
    const dueDateValue = new Date(dueDate);
    const oneWeekBefore = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000); // 一週間前
    if (dueDateValue <= today && progress !== '100') {
        task.style.backgroundColor = 'rgb(255, 103, 103)'; // 期限が過ぎて進行度が100でない場合は赤色
    } else if (dueDateValue <= oneWeekBefore && progress !== '100') {
        task.style.backgroundColor = 'rgb(255, 199, 80)'; // 期限の一週間前で進行度が100でない場合は黄色
    }

    // 進行度変更用のセレクトボックスを追加
    const progressSelectCopy = progressSelect.cloneNode(true);
    progressSelectCopy.addEventListener('change', function() {
        const selectedProgress = this.value;
        progressIndicator.style.width = `${selectedProgress}%`;

        // 進行度が100の場合は背景色を緑に
        if (selectedProgress === '100') {
            task.style.backgroundColor = 'rgb(128, 255, 103)';
        } else {
            // 進行度が100でない場合は背景色を元に戻す
            const today = new Date();
            const dueDateValue = new Date(dueDate);
            const oneWeekBefore = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000); // 一週間前
            if (dueDateValue <= today && selectedProgress !== '100') {
                task.style.backgroundColor = 'rgb(255, 103, 103)'; // 期限が過ぎて進行度が100でない場合は赤色
            } else if (dueDateValue <= oneWeekBefore && selectedProgress !== '100') {
                task.style.backgroundColor = 'rgb(255, 199, 80)'; // 期限の一週間前で進行度が100でない場合は黄色
            } else {
                task.style.backgroundColor = ''; // それ以外はデフォルトの背景色に
            }
        }

        saveTasks(); // 進行度変更後にローカルストレージに保存
    });

    const newTaskForm = document.querySelector('.task-form');
    newTaskForm.reset();
    progressSelect.selectedIndex = 0; // 進行度の選択状態をリセット

    task.appendChild(taskHeader);
    task.appendChild(contentParagraph);
    task.appendChild(progressBar);
    task.appendChild(tags);
    task.appendChild(dueDateText);
    task.appendChild(progressSelectCopy); // 進行度変更用のセレクトボックスを追加
    task.appendChild(deleteButton);

    taskList.prepend(task);

    saveTasks(); // タスク追加後にローカルストレージに保存
}

// タスクをローカルストレージに保存する関数
function saveTasks() {
    const tasks = getTasksAsArray(); // タスクを配列として取得
    localStorage.setItem('tasks', JSON.stringify(tasks)); // タスクをJSON形式に変換して保存
}

// タスクを配列として取得する関数
function getTasksAsArray() {
    const taskElements = document.querySelectorAll('.task');
    const tasks = [];
    taskElements.forEach(taskElement => {
        const task = {
            name: taskElement.querySelector('h3').textContent,
            content: taskElement.querySelector('p').textContent.split(": ")[1],
            tag: taskElement.querySelector('.tags').textContent.split(": ")[1],
            progress: taskElement.querySelector('.progress').style.width,
            dueDate: taskElement.querySelector('p:last-of-type').textContent.split(": ")[1]
        };
        tasks.push(task);
    });
    return tasks;
}

// 保存されたタスクをロードする関数
function loadTasks() {
    const tasks = localStorage.getItem('tasks');
    if (tasks) {
        taskList.innerHTML = ""; // タスクリストを初期化

        const taskObjects = JSON.parse(tasks); // JSON形式の文字列をオブジェクトにパースする
        taskObjects.forEach(task => {
            const taskElement = createTaskElement(task); // タスクオブジェクトからHTML要素を作成
            taskList.appendChild(taskElement); // タスクリストに追加
        });
    }
}

// タスクオブジェクト
function createTaskElement(task) {
    const taskElement = document.createElement('div');
    taskElement.classList.add('task');

    const taskHeader = document.createElement('h3');
    taskHeader.textContent = task.name;

    const contentParagraph = document.createElement('p');
    contentParagraph.textContent = `内容: ${task.content}`;

    const tags = document.createElement('div');
    tags.classList.add('tags');
    tags.textContent = `教科: ${task.tag}`;

    const progressBar = document.createElement('div');
    progressBar.classList.add('progress-bar');
    const progressIndicator = document.createElement('div');
    progressIndicator.classList.add('progress');
    progressIndicator.style.width = task.progress;
    progressBar.appendChild(progressIndicator);

    const dueDateText = document.createElement('p');
    dueDateText.textContent = `期限: ${task.dueDate}`;

    const deleteButton = document.createElement('button');
    deleteButton.textContent = '削除';
    deleteButton.addEventListener('click', function() {
        taskElement.remove();
        saveTasks(); // タスク削除後にローカルストレージに保存
    });

    taskElement.appendChild(taskHeader);
    taskElement.appendChild(contentParagraph);
    taskElement.appendChild(progressBar);
    taskElement.appendChild(tags);
    taskElement.appendChild(dueDateText);
    taskElement.appendChild(deleteButton);

    // 進行度変更用のセレクトボックスを追加
    const progressSelectCopy = document.getElementById('progress').cloneNode(true);
    progressSelectCopy.addEventListener('change', function() {
        const selectedProgress = this.value;
        progressIndicator.style.width = `${selectedProgress}%`;

        // 進行度が100の場合は背景色を緑に
        if (selectedProgress === '100') {
            taskElement.style.backgroundColor = 'rgb(128, 255, 103)';
        } else {
            // 進行度が100でない場合は背景色を元に戻す
            const today = new Date();
            const dueDateValue = new Date(task.dueDate);
            const oneWeekBefore = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000); // 一週間前
            if (dueDateValue <= today && selectedProgress !== '100') {
                taskElement.style.backgroundColor = 'rgb(255, 103, 103)'; // 期限が過ぎて進行度が100でない場合は赤色
            } else if (dueDateValue <= oneWeekBefore && selectedProgress !== '100') {
                taskElement.style.backgroundColor = 'rgb(255, 199, 80)'; // 期限の一週間前で進行度が100でない場合は黄色
            } else {
                taskElement.style.backgroundColor = ''; // それ以外はデフォルトの背景色に
            }
        }

        saveTasks(); // 進行度変更後にローカルストレージに保存
    });

    taskElement.appendChild(progressSelectCopy); // 進行度変更用のセレクトボックスを追加

    return taskElement;
}

// 進行度変更用のセレクトボックスを追加
const progressSelectCopy = progressSelect.cloneNode(true);
progressSelectCopy.value = progress; // 選択された進行度を設定
progressSelectCopy.addEventListener('change', function() {
    const selectedProgress = this.value;
    progressIndicator.style.width = `${selectedProgress}%`;

    // 進行度が100の場合は背景色を緑に
    if (selectedProgress === '100') {
        taskElement.style.backgroundColor = 'rgb(128, 255, 103)';
    } else {
        // 進行度が100でない場合は背景色を元に戻す
        const today = new Date();
        const dueDateValue = new Date(task.dueDate);
        const oneWeekBefore = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000); // 一週間前
        if (dueDateValue <= today && selectedProgress !== '100') {
            taskElement.style.backgroundColor = 'rgb(255, 103, 103)'; // 期限が過ぎて進行度が100でない場合は赤色
        } else if (dueDateValue <= oneWeekBefore && selectedProgress !== '100') {
            taskElement.style.backgroundColor = 'rgb(255, 199, 80)'; // 期限の一週間前で進行度が100でない場合は黄色
        } else {
            taskElement.style.backgroundColor = ''; // それ以外はデフォルトの背景色に
        }
    }

    saveTasks(); // 進行度変更後にローカルストレージに保存
});
