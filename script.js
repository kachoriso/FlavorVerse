class FlavorVerse {
    constructor() {
        this.currentStep = 1;
        this.wineImage = null;
        this.selectedFlavors = [];
        this.customFlavors = [];
        this.poetryLevel = 3;
        // ローカルストレージから最後に選択したタグを読み込み、なければデフォルトは「ワイン」
        this.currentTag = localStorage.getItem('lastSelectedTag') || 'ワイン';
        this.savedNotes = [];
        
        // タグ別フレーバー定義
        this.flavorDefinitions = {
            'ワイン': this.getWineFlavors(),
            'ウイスキー': this.getWhiskeyFlavors()
        };
        
        // フレーバー英語→日本語変換マップ
        this.flavorMap = {
            // 柑橘系フルーツ
            'lemon': 'レモン',
            'lime': 'ライム',
            'grapefruit': 'グレープフルーツ',
            'orange': 'オレンジ',
            
            // ベリー系フルーツ
            'strawberry': 'イチゴ',
            'raspberry': 'ラズベリー',
            'blackberry': 'ブラックベリー',
            'blueberry': 'ブルーベリー',
            'cherry': 'チェリー',
            'cranberry': 'クランベリー',
            
            // 熱帯フルーツ
            'pineapple': 'パイナップル',
            'mango': 'マンゴー',
            'passion-fruit': 'パッションフルーツ',
            'banana': 'バナナ',
            'coconut': 'ココナッツ',
            'lychee': 'ライチ',
            
            // 石果・その他フルーツ
            'apple': 'リンゴ',
            'pear': '梨',
            'peach': '桃',
            'apricot': 'アプリコット',
            'plum': 'プラム',
            'fig': 'イチジク',
            'raisin': 'レーズン',
            'date': 'デーツ',
            
            // 花・植物
            'rose': 'バラ',
            'lavender': 'ラベンダー',
            'jasmine': 'ジャスミン',
            'violet': 'スミレ',
            'elderflower': 'エルダーフラワー',
            'hibiscus': 'ハイビスカス',
            
            // スパイス・ハーブ
            'vanilla': 'バニラ',
            'cinnamon': 'シナモン',
            'clove': 'クローブ',
            'nutmeg': 'ナツメグ',
            'ginger': 'ジンジャー',
            'pepper': 'ペッパー',
            'cardamom': 'カルダモン',
            'anise': 'アニス',
            'mint': 'ミント',
            'basil': 'バジル',
            'thyme': 'タイム',
            'rosemary': 'ローズマリー',
            
            // ナッツ・種子
            'almond': 'アーモンド',
            'walnut': 'クルミ',
            'hazelnut': 'ヘーゼルナッツ',
            'pecan': 'ピーカン',
            'pistachio': 'ピスタチオ',
            'coconut': 'ココナッツ',
            'sesame': 'ゴマ',
            
            // チョコレート・カカオ
            'chocolate': 'チョコレート',
            'cocoa': 'ココア',
            'coffee': 'コーヒー',
            'caramel': 'キャラメル',
            'toffee': 'トフィー',
            'molasses': 'モラセス',
            
            // 乳製品・クリーム
            'cream': 'クリーム',
            'butter': 'バター',
            'yogurt': 'ヨーグルト',
            'cheese': 'チーズ',
            'milk': 'ミルク',
            
            // 動物・その他
            'leather': '革',
            'tobacco': 'タバコ',
            'smoke': '煙',
            'truffle': 'トリュフ',
            
            // 野菜・ハーブ
            'bell-pepper': 'ピーマン',
            'asparagus': 'アスパラガス',
            'grass': '芝生',
            'herbs': 'ハーブ'
        };
        
        // API設定
        this.apiConfig = {
            proxy: {
                baseUrl: "http://localhost:8003/api",
                timeout: 15000
            },
            providers: ['gemini', 'groq'] // Gemini → Groq → テンプレート
        };
        
        // APIキーの保存（ソースコード管理）
        this.apiKeys = {
            gemini: 'YOUR_GEMINI_API_KEY',
            groq: 'YOUR_GROQ_API_KEY'
        };
        
        this.init();
    }

    // ウイスキーフレーバー定義（画像から抽出）
    getWhiskeyFlavors() {
        return {
            'フルーティ': ['マンゴー', 'バナナ', 'パイナップル', 'メロン', 'パッションフルーツ', 'レモン', 'ライム', 'オレンジ', 'グレープフルーツ', 'ピールのシロップ漬け', '青リンゴ', '赤リンゴ', '洋梨', 'さくらんぼ', 'もも', 'プラム', 'いちご', 'フランボワーズ', 'カシス', 'レーズン', 'ドライプルーン', 'ドライイチジク', 'ドライアプリコット'],
            'フローラル': ['バラ', 'シトラス系の花', 'ヘザー、ヒース', '白い花', 'ラベンダー', 'スミレ'],
            'ハーブ系': ['ミント', 'タイム', '芝生', '甘草', '干し草'],
            '穀物': ['ビスケット', 'コーン', 'モルト・麦芽', 'コーヒー', 'チョコレート', 'トースト', 'パン'],
            'テール・フェインツ': ['酵母', 'グレービー、肉感', '紅茶', 'バター', '革'],
            '硫黄系': ['なめし革', 'ゴム', '茹でキャベツ', 'ゆで卵', 'ろうそく', 'たばこ'],
            'ピート・薫香': ['煙', '焚火', '泥炭', 'ベーコン', 'タール', '海藻', 'ヨードチンキ', '魚'],
            '樽熟成': ['バニラ', 'キャラメル', 'メープル', 'ハチミツ', 'クルミ', 'ヘーゼルナッツ', 'アーモンド', 'ココナッツ', 'ヒノキ', '杉', 'サンダルウッド', 'オーク', 'シナモン', 'コリアンダー', 'ナツメグ', 'クローブ', '胡椒', 'ジンジャー', 'アニス', 'シェリー', 'マディラ'],
            'その他': []
        };
    }

    // ワインフレーバー定義（既存）
    getWineFlavors() {
        return {
            '柑橘系フルーツ': ['レモン', 'ライム', 'グレープフルーツ', 'オレンジ'],
            'ベリー類': ['イチゴ', 'ラズベリー', 'ブラックベリー', 'ブルーベリー'],
            '核果': ['さくらんぼ', 'もも', 'プラム', 'アプリコット'],
            '熱帯フルーツ': ['マンゴー', 'パイナップル', 'パッションフルーツ', 'リッチ'],
            'ドライフルーツ': ['レーズン', 'プルーン', 'イチジク', 'デーツ'],
            'フローラル': ['バラ', 'ラベンダー', 'スミレ', 'ジャスミン'],
            'ハーブ・スパイス': ['ミント', 'タイム', 'ローズマリー', 'シナモン'],
            'ナッツ・木の実': ['アーモンド', 'ヘーゼルナッツ', 'クルミ', 'ココナッツ'],
            '土壌・ミネラル': ['石', '鉱物', 'チョーク', '粘土'],
            '樽・オーク': ['バニラ', 'キャラメル', 'トースト', 'スモーク'],
            'その他': []
        };
    }

    // 日本酒・焼酎フレーバー定義
    getSakeFlavors() {
        return {
            'フルーティ': ['りんご', '梨', 'メロン', 'バナナ', 'いちご'],
            'フローラル': ['桜', '白い花', 'ラベンダー'],
            '穀物・米': ['米', '麹', '酒粕', '甘酒'],
            'ハーブ・スパイス': ['ミント', '甘草', 'シナモン'],
            'ナッツ・木の実': ['アーモンド', 'クルミ'],
            '土壌・ミネラル': ['石', '鉱物', 'チョーク'],
            'その他': []
        };
    }

    // コーヒーフレーバー定義
    getCoffeeFlavors() {
        return {
            'フルーティ': ['ベリー', 'さくらんぼ', 'りんご', 'レモン', 'オレンジ'],
            'フローラル': ['ジャスミン', 'バラ', 'ラベンダー'],
            'ナッツ・木の実': ['アーモンド', 'ヘーゼルナッツ', 'クルミ', 'ココナッツ'],
            'チョコレート・キャラメル': ['チョコレート', 'キャラメル', 'カラメル', 'トフィー'],
            'スパイス': ['シナモン', 'ナツメグ', 'クローブ', '胡椒'],
            'ハーブ・植物': ['ミント', '甘草', 'タバコ', '杉'],
            '土壌・ミネラル': ['石', '鉱物', 'チョーク'],
            'その他': []
        };
    }

    // 紅茶フレーバー定義
    getTeaFlavors() {
        return {
            'フルーティ': ['ベリー', 'さくらんぼ', 'りんご', 'レモン', 'オレンジ', '桃'],
            'フローラル': ['バラ', 'ジャスミン', 'ラベンダー', 'スミレ'],
            'ハーブ・スパイス': ['ミント', 'シナモン', 'ジンジャー', 'クローブ', 'カルダモン'],
            'ナッツ・木の実': ['アーモンド', 'ヘーゼルナッツ', 'クルミ'],
            '土壌・ミネラル': ['石', '鉱物', 'チョーク'],
            'その他': []
        };
    }

    // フレーバーオプションを更新
    updateFlavorOptions() {
        const flavors = this.flavorDefinitions[this.currentTag] || this.flavorDefinitions['ワイン'];
        
        // デスクトップ用フレーバーホイールを更新
        this.updateDesktopFlavorWheel(flavors);
        
        // モバイル用フレーバーグリッドを更新
        this.updateMobileFlavorGrid(flavors);
    }

    // デスクトップ用フレーバーホイールを更新
    updateDesktopFlavorWheel(flavors) {
        const flavorWheel = document.querySelector('.flavor-wheel.desktop-only');
        if (!flavorWheel) return;

        let html = '';
        for (const [category, flavorList] of Object.entries(flavors)) {
            html += `
                <div class="flavor-category">
                    <div class="category-header">
                        <h3>${this.getCategoryEmoji(category)} ${category}</h3>
                        <button class="category-toggle" data-category="${category}">▼</button>
                    </div>
                    <div class="flavor-options" data-category="${category}">
            `;
            
            // その他カテゴリの場合はフリー入力機能を追加
            if (category === 'その他') {
                html += `
                    <div class="custom-flavor-input">
                        <input type="text" id="custom-flavor" placeholder="フレーバーを入力してください" maxlength="20">
                        <button id="add-custom-flavor" class="btn btn-outline">追加</button>
                    </div>
                    <div id="custom-flavors-list" class="custom-flavors-list"></div>
                `;
            } else {
                // 通常のフレーバーリスト
                for (const flavor of flavorList) {
                    html += `<label><input type="checkbox" value="${flavor}"> ${flavor}</label>`;
                }
            }
            
            html += `
                    </div>
                </div>
            `;
        }
        
        flavorWheel.innerHTML = html;
        
        // イベントリスナーを再設定
        this.bindFlavorEvents();
    }

    // モバイル用フレーバーグリッドを更新
    updateMobileFlavorGrid(flavors) {
        const mobileTabs = document.querySelector('.mobile-flavor-tabs');
        if (!mobileTabs) return;

        // タブボタンを生成
        let tabButtonsHtml = '';
        let tabContentHtml = '';
        
        for (const [category, flavorList] of Object.entries(flavors)) {
            // タブボタンを生成
            const isActive = Object.keys(flavors).indexOf(category) === 0 ? 'active' : '';
            tabButtonsHtml += `<button class="tab-button ${isActive}" data-tab="${category}">${this.getCategoryEmoji(category)}</button>`;
            
            // タブコンテンツを生成
            const isActiveContent = Object.keys(flavors).indexOf(category) === 0 ? 'active' : '';
            tabContentHtml += `
                <div class="tab-panel ${isActiveContent}" id="tab-${category}">
                    <h3>${this.getCategoryEmoji(category)} ${category}</h3>
                    <div class="mobile-flavor-grid">
            `;
            
            // その他カテゴリの場合はフリー入力機能を追加
            if (category === 'その他') {
                tabContentHtml += `
                    <div class="custom-flavor-input">
                        <input type="text" id="custom-flavor-mobile" placeholder="フレーバーを入力してください" maxlength="20">
                        <button id="add-custom-flavor-mobile" class="btn btn-outline">追加</button>
                    </div>
                    <div id="custom-flavors-list-mobile" class="custom-flavors-list"></div>
                `;
            } else {
                // 通常のフレーバーリスト
                for (const flavor of flavorList) {
                    tabContentHtml += `<label><input type="checkbox" value="${flavor}"> ${flavor}</label>`;
                }
            }
            
            tabContentHtml += `
                    </div>
                </div>
            `;
        }
        
        // 完全なHTMLを生成
        const fullHtml = `
            <div class="flavor-tabs">
                ${tabButtonsHtml}
            </div>
            <div class="tab-content">
                ${tabContentHtml}
            </div>
        `;
        
        mobileTabs.innerHTML = fullHtml;
        
        // モバイル用イベントリスナーを再設定
        this.bindMobileFlavorEvents();
    }

    // カテゴリの絵文字を取得
    getCategoryEmoji(category) {
        const emojiMap = {
            // ウイスキー用カテゴリ
            'フルーティ': '🍊',
            'フローラル': '🌸',
            'ハーブ系': '🌿',
            '穀物': '🌾',
            'テール・フェインツ': '🥃',
            '硫黄系': '⚗️',
            'ピート・薫香': '🔥',
            '樽熟成': '🛢️',
            'その他': '✏️',
            // ワイン用カテゴリ
            '柑橘系フルーツ': '🍊',
            'ベリー類': '🍓',
            '核果': '🍑',
            '熱帯フルーツ': '🥭',
            'ドライフルーツ': '🍇',
            'ハーブ・スパイス': '🌿',
            'ナッツ・木の実': '🥜',
            '土壌・ミネラル': '🪨',
            '樽・オーク': '🛢️',
            '穀物・米': '🌾',
            'チョコレート・キャラメル': '🍫',
            'スパイス': '🌶️',
            'ハーブ・植物': '🌿'
        };
        return emojiMap[category] || '🍷';
    }

    init() {
        this.loadSavedNotes(); // 保存されたノートを読み込み
        this.bindEvents();
        this.updatePoetryDescription();
        this.initSettings();
        this.loadSettings();
        // 初期フレーバーオプションを設定
        this.updateFlavorOptions();
        // 初期タグ選択UIを設定
        this.updateTagSelectionUI();
    }

    // フレーバーイベントをバインド
    bindFlavorEvents() {
        // カテゴリトグルボタン
        document.querySelectorAll('.category-toggle').forEach(button => {
            button.addEventListener('click', (e) => {
                const category = e.target.dataset.category;
                const options = document.querySelector(`.flavor-options[data-category="${category}"]`);
                const isCollapsed = options.classList.contains('collapsed');
                
                if (isCollapsed) {
                    options.classList.remove('collapsed');
                    e.target.textContent = '▼';
                } else {
                    options.classList.add('collapsed');
                    e.target.textContent = '▶';
                }
            });
        });

        // フレーバーチェックボックス
        document.querySelectorAll('.flavor-options input[type="checkbox"]').forEach(checkbox => {
            checkbox.addEventListener('change', (e) => {
                this.updateSelectedFlavors();
            });
        });

        // カスタムフレーバー追加（デスクトップ）
        const addCustomFlavorBtn = document.getElementById('add-custom-flavor');
        if (addCustomFlavorBtn) {
            addCustomFlavorBtn.addEventListener('click', () => {
                this.addCustomFlavor('desktop');
            });
        }

        // カスタムフレーバー追加（モバイル）
        const addCustomFlavorMobileBtn = document.getElementById('add-custom-flavor-mobile');
        if (addCustomFlavorMobileBtn) {
            addCustomFlavorMobileBtn.addEventListener('click', () => {
                this.addCustomFlavor('mobile');
            });
        }
    }

    // モバイル用フレーバーイベントをバインド
    bindMobileFlavorEvents() {
        // モバイル用フレーバーチェックボックス
        document.querySelectorAll('.mobile-flavor-grid input[type="checkbox"]').forEach(checkbox => {
            checkbox.addEventListener('change', (e) => {
                this.updateSelectedFlavors();
            });
        });
        
        // モバイル用タブボタン
        document.querySelectorAll('.tab-button').forEach(button => {
            button.addEventListener('click', (e) => {
                const targetTab = e.target.dataset.tab;
                
                // 全てのタブボタンからactiveクラスを削除
                document.querySelectorAll('.tab-button').forEach(btn => btn.classList.remove('active'));
                // クリックされたボタンにactiveクラスを追加
                e.target.classList.add('active');
                
                // 全てのタブパネルからactiveクラスを削除
                document.querySelectorAll('.tab-panel').forEach(panel => panel.classList.remove('active'));
                // 対象のタブパネルにactiveクラスを追加
                const targetPanel = document.getElementById(`tab-${targetTab}`);
                if (targetPanel) {
                    targetPanel.classList.add('active');
                }
            });
        });
    }

    // カスタムフレーバーを追加
    addCustomFlavor(platform) {
        const inputId = platform === 'mobile' ? 'custom-flavor-mobile' : 'custom-flavor';
        const listId = platform === 'mobile' ? 'custom-flavors-list-mobile' : 'custom-flavors-list';
        
        const input = document.getElementById(inputId);
        const list = document.getElementById(listId);
        
        if (!input || !list) return;
        
        const flavor = input.value.trim();
        if (!flavor) return;
        
        // 重複チェック
        if (this.customFlavors.includes(flavor)) {
            alert('このフレーバーは既に追加されています。');
            return;
        }
        
        // カスタムフレーバーリストに追加
        this.customFlavors.push(flavor);
        
        // UIに追加
        const flavorElement = document.createElement('div');
        flavorElement.className = 'custom-flavor-item';
        flavorElement.innerHTML = `
            <label>
                <input type="checkbox" value="${flavor}" checked>
                ${flavor}
            </label>
            <button class="remove-custom-flavor" data-flavor="${flavor}">×</button>
        `;
        
        list.appendChild(flavorElement);
        
        // 入力フィールドをクリア
        input.value = '';
        
        // イベントリスナーを追加
        const checkbox = flavorElement.querySelector('input[type="checkbox"]');
        checkbox.addEventListener('change', () => {
            this.updateSelectedFlavors();
        });
        
        const removeBtn = flavorElement.querySelector('.remove-custom-flavor');
        removeBtn.addEventListener('click', () => {
            this.removeCustomFlavor(flavor, platform);
        });
        
        // 選択されたフレーバーを更新
        this.updateSelectedFlavors();
    }

    // カスタムフレーバーを削除
    removeCustomFlavor(flavor, platform) {
        // 配列から削除
        this.customFlavors = this.customFlavors.filter(f => f !== flavor);
        
        // UIから削除
        const listId = platform === 'mobile' ? 'custom-flavors-list-mobile' : 'custom-flavors-list';
        const list = document.getElementById(listId);
        if (list) {
            const items = list.querySelectorAll('.custom-flavor-item');
            items.forEach(item => {
                const checkbox = item.querySelector('input[type="checkbox"]');
                if (checkbox && checkbox.value === flavor) {
                    item.remove();
                }
            });
        }
        
        // 選択されたフレーバーを更新
        this.updateSelectedFlavors();
    }

    // 選択されたフレーバーを更新
    updateSelectedFlavors() {
        this.selectedFlavors = [];
        
        // デスクトップ用チェックボックス
        document.querySelectorAll('.flavor-options input[type="checkbox"]:checked').forEach(checkbox => {
            this.selectedFlavors.push(checkbox.value);
        });
        
        // モバイル用チェックボックス
        document.querySelectorAll('.mobile-flavor-grid input[type="checkbox"]:checked').forEach(checkbox => {
            if (!this.selectedFlavors.includes(checkbox.value)) {
                this.selectedFlavors.push(checkbox.value);
            }
        });
        
        // カスタムフレーバーを追加
        this.selectedFlavors = this.selectedFlavors.concat(this.customFlavors);
        
        // 確認ボタンの表示/非表示
        const totalFlavors = this.selectedFlavors.length;
        const confirmButton = document.getElementById('confirm-flavors');
        if (confirmButton) {
            confirmButton.style.display = totalFlavors > 0 ? 'inline-block' : 'none';
        }
    }

    bindEvents() {
        // Camera controls（安全にイベントリスナーを追加）
        const startCameraBtn = document.getElementById('start-camera');
        if (startCameraBtn) {
            startCameraBtn.addEventListener('click', () => this.startCamera());
        } else {
            console.warn('start-cameraボタンが見つかりません');
        }
        
        const capturePhotoBtn = document.getElementById('capture-photo');
        if (capturePhotoBtn) {
            capturePhotoBtn.addEventListener('click', () => this.capturePhoto());
        } else {
            console.warn('capture-photoボタンが見つかりません');
        }
        
        const uploadFileBtn = document.getElementById('upload-file');
        if (uploadFileBtn) {
            uploadFileBtn.addEventListener('click', () => this.triggerFileUpload());
        } else {
            console.warn('upload-fileボタンが見つかりません');
        }
        
        const fileInput = document.getElementById('file-input');
        if (fileInput) {
            fileInput.addEventListener('change', (e) => this.handleFileUpload(e));
        } else {
            console.warn('file-inputが見つかりません');
        }
        
        const retakePhotoBtn = document.getElementById('retake-photo');
        if (retakePhotoBtn) {
            retakePhotoBtn.addEventListener('click', () => this.retakePhoto());
        } else {
            console.warn('retake-photoボタンが見つかりません');
        }
        
        const skipPhotoBtn = document.getElementById('skip-photo');
        if (skipPhotoBtn) {
            skipPhotoBtn.addEventListener('click', () => this.skipPhoto());
        } else {
            console.warn('skip-photoボタンが見つかりません');
        }
        
        // Toggle step buttons（安全にイベントリスナーを追加）
        const toggleStep1 = document.getElementById('toggle-step-1');
        if (toggleStep1) {
            toggleStep1.addEventListener('click', () => this.toggleStep(1));
        }
        
        const toggleStep2 = document.getElementById('toggle-step-2');
        if (toggleStep2) {
            toggleStep2.addEventListener('click', () => this.toggleStep(2));
        }
        
        const toggleStep3 = document.getElementById('toggle-step-3');
        if (toggleStep3) {
            toggleStep3.addEventListener('click', () => this.toggleStep(3));
        }
        
        const toggleStep4 = document.getElementById('toggle-step-4');
        if (toggleStep4) {
            toggleStep4.addEventListener('click', () => this.toggleStep(4));
        }
        
        // Tag selection event listeners（安全にイベントリスナーを追加）
        const tagOptions = document.querySelectorAll('.tag-option');
        if (tagOptions.length > 0) {
            tagOptions.forEach(button => {
                button.addEventListener('click', (e) => {
                    // 全てのタグオプションからselectedクラスを削除
                    document.querySelectorAll('.tag-option').forEach(btn => btn.classList.remove('selected'));
                    // クリックされたボタンにselectedクラスを追加
                    e.target.classList.add('selected');
                    // 選択されたタグを更新
                    this.currentTag = e.target.dataset.tag;
                    // 選択されたタグの表示を更新
                    const currentTagElement = document.getElementById('current-tag');
                    if (currentTagElement) {
                        currentTagElement.textContent = this.currentTag;
                    }
                    // 選択されたタグをローカルストレージに保存
                    localStorage.setItem('lastSelectedTag', this.currentTag);
                    // フレーバー選択を更新
                    this.updateFlavorOptions();
                });
            });
        } else {
            console.warn('タグオプションボタンが見つかりません');
        }

        // Tag confirmation button（安全にイベントリスナーを追加）
        const confirmTagBtn = document.getElementById('confirm-tag');
        if (confirmTagBtn) {
            confirmTagBtn.addEventListener('click', () => {
                this.showStep(3); // フレーバー選択ステップに進む
            });
        } else {
            console.warn('confirm-tagボタンが見つかりません');
        }
        
        // Confirm flavors button（安全にイベントリスナーを追加）
        const confirmFlavorsBtn = document.getElementById('confirm-flavors');
        if (confirmFlavorsBtn) {
            confirmFlavorsBtn.addEventListener('click', () => this.confirmFlavors());
        } else {
            console.warn('confirm-flavorsボタンが見つかりません');
        }
        
        // Confirm poetry button（ステップ4スキップのためコメントアウト）
        // document.getElementById('confirm-poetry').addEventListener('click', () => this.confirmPoetry());
        
        // Custom flavor input (安全にイベントリスナーを追加)
        const addCustomFlavorBtn = document.getElementById('add-custom-flavor');
        if (addCustomFlavorBtn) {
            addCustomFlavorBtn.addEventListener('click', () => this.addCustomFlavor('desktop'));
        }
        
        const customFlavorInput = document.getElementById('custom-flavor');
        if (customFlavorInput) {
            customFlavorInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    this.addCustomFlavor('desktop');
                }
            });
        }
        
        // Category toggles (安全にイベントリスナーを追加)
        const categoryToggles = document.querySelectorAll('.category-toggle');
        if (categoryToggles.length > 0) {
            categoryToggles.forEach(toggle => {
                toggle.addEventListener('click', (e) => this.toggleCategory(e));
            });
        }
        
        // Mobile tab buttons (安全にイベントリスナーを追加)
        const tabButtons = document.querySelectorAll('.tab-button');
        if (tabButtons.length > 0) {
            tabButtons.forEach(button => {
                button.addEventListener('click', (e) => this.switchTab(e));
            });
        }
        
        // Mobile custom flavor events
        const addCustomFlavorMobileBtn = document.getElementById('add-custom-flavor-mobile');
        const customFlavorMobileInput = document.getElementById('custom-flavor-mobile');
        
        if (addCustomFlavorMobileBtn) {
            addCustomFlavorMobileBtn.addEventListener('click', () => this.addCustomFlavorMobile());
        }
        
        if (customFlavorMobileInput) {
            customFlavorMobileInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    this.addCustomFlavorMobile();
                }
            });
        }
        
        // Mobile flavor selection events (安全にイベントリスナーを追加)
        const mobileFlavorCheckboxes = document.querySelectorAll('.mobile-flavor-grid input[type="checkbox"]');
        if (mobileFlavorCheckboxes.length > 0) {
            mobileFlavorCheckboxes.forEach(checkbox => {
                checkbox.addEventListener('change', (e) => this.handleFlavorSelection(e));
            });
        }
        
        // 画面サイズ変更時の処理
        window.addEventListener('resize', () => this.handleResize());
        
        // 初期化時に画面サイズに応じた状態を設定
        this.initializeCategoryStates();
        
        // 保存されたノートを読み込み
        this.loadSavedNotes();

        // Flavor selection (安全にイベントリスナーを追加)
        const flavorCheckboxes = document.querySelectorAll('.flavor-options input[type="checkbox"]');
        if (flavorCheckboxes.length > 0) {
            flavorCheckboxes.forEach(checkbox => {
                checkbox.addEventListener('change', (e) => this.handleFlavorSelection(e));
            });
        }

        // Poetry level (安全にイベントリスナーを追加)
        // ポエム度合いスライダー（一時的にコメントアウト）
        /*
        const poetryRange = document.getElementById('poetry-range');
        if (poetryRange) {
            poetryRange.addEventListener('input', (e) => this.handlePoetryChange(e));
        }
        */

        // Generate notes (removed - now handled by confirm-poetry button)

        // Result actions (安全にイベントリスナーを追加)
        const regenerateBtn = document.getElementById('regenerate');
        if (regenerateBtn) {
            regenerateBtn.addEventListener('click', () => this.generateTastingNotes());
        }
        
        const copyNoteBtn = document.getElementById('copy-note');
        if (copyNoteBtn) {
            copyNoteBtn.addEventListener('click', () => this.copyToClipboard());
        }
        
        const saveNoteBtn = document.getElementById('save-note');
        if (saveNoteBtn) {
            saveNoteBtn.addEventListener('click', () => {
                this.saveTastingNote();
            });
        }
        
        const startOverBtn = document.getElementById('start-over');
        if (startOverBtn) {
            startOverBtn.addEventListener('click', () => this.startOver());
        }
        
        // テスト用：保存機能のテスト
        if (window.location.search.includes('test=save')) {
            this.testSaveFunction();
        }
        
        // Navigation
        const navHome = document.getElementById('navHome');
        const navList = document.getElementById('navList');
        
        if (navHome) {
            navHome.addEventListener('click', () => {
                this.animateNavItem(navHome);
                // ホームに戻る前に完全リセット（警告付き）
                this.startOver();
                setTimeout(() => this.showPage('home'), 200);
            });
        } else {
            console.error('navHome要素が見つかりません');
        }
        
        if (navList) {
            navList.addEventListener('click', () => {
                this.animateNavItem(navList);
                setTimeout(() => this.showPage('list'), 200);
            });
        } else {
            console.error('navList要素が見つかりません');
        }
        
        // 設定メニューは削除済み（navSettings要素は存在しない）
        
        // List page controls (安全にイベントリスナーを追加)
        const searchInput = document.getElementById('searchInput');
        if (searchInput) {
            searchInput.addEventListener('input', () => this.filterNotes());
        }
        
        const searchBtn = document.getElementById('searchBtn');
        if (searchBtn) {
            searchBtn.addEventListener('click', () => this.filterNotes());
        }
        
        const tagFilter = document.getElementById('tagFilter');
        if (tagFilter) {
            tagFilter.addEventListener('change', () => this.filterNotes());
        }
        
        const sortBy = document.getElementById('sortBy');
        if (sortBy) {
            sortBy.addEventListener('change', () => this.filterNotes());
        }
        
        // Settings page controls (安全にイベントリスナーを追加)
        const exportData = document.getElementById('exportData');
        if (exportData) {
            exportData.addEventListener('click', () => this.exportData());
        }
        
        const importData = document.getElementById('importData');
        if (importData) {
            importData.addEventListener('click', () => {
                const importFile = document.getElementById('importFile');
                if (importFile) {
                    importFile.click();
                }
            });
        }
        
        const importFile = document.getElementById('importFile');
        if (importFile) {
            importFile.addEventListener('change', (e) => this.importData(e));
        }
        
        const clearAllData = document.getElementById('clearAllData');
        if (clearAllData) {
            clearAllData.addEventListener('click', () => this.clearAllData());
        }

        // Hamburger menu
        const hamburgerMenu = document.getElementById('hamburgerMenu');
        const navMenu = document.getElementById('navMenu');
        
        if (hamburgerMenu) {
            // 新しいイベントリスナーを追加
            hamburgerMenu.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                this.toggleNavMenu();
            });
        } else {
            console.error('ハンバーガーメニュー要素が見つかりません');
        }
        
        
        // Default poetry level（安全にイベントリスナーを追加）
        const defaultPoetryLevel = document.getElementById('defaultPoetryLevel');
        if (defaultPoetryLevel) {
            defaultPoetryLevel.addEventListener('input', (e) => {
                const poetryLevelValue = document.getElementById('poetryLevelValue');
                if (poetryLevelValue) {
                    poetryLevelValue.textContent = e.target.value;
                }
            });
        }
        

        // API key management removed - keys are now in source code
    }

    async startCamera() {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ 
                video: { facingMode: 'environment' } 
            });
            const video = document.getElementById('video');
            video.srcObject = stream;
            
            // カメラプレビューを表示
            document.getElementById('camera-preview').style.display = 'block';
            document.getElementById('start-camera').style.display = 'none';
            document.getElementById('capture-photo').style.display = 'inline-block';
        } catch (error) {
            console.error('カメラアクセスエラー:', error);
            alert('カメラにアクセスできませんでした。ファイルアップロードをご利用ください。');
        }
    }

    capturePhoto() {
        const video = document.getElementById('video');
        const canvas = document.getElementById('canvas');
        const context = canvas.getContext('2d');

        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        context.drawImage(video, 0, 0);

        // Stop camera stream
        const stream = video.srcObject;
        const tracks = stream.getTracks();
        tracks.forEach(track => track.stop());

        // Convert to blob and display
        canvas.toBlob(blob => {
            this.wineImage = blob;
            this.displayCapturedImage(canvas.toDataURL());
        });
    }

    triggerFileUpload() {
        document.getElementById('file-input').click();
    }

    handleFileUpload(event) {
        const file = event.target.files[0];
        if (file && file.type.startsWith('image/')) {
            this.wineImage = file;
            const reader = new FileReader();
            reader.onload = (e) => this.displayCapturedImage(e.target.result);
            reader.readAsDataURL(file);
            
            // カメラプレビューを非表示にする
            document.getElementById('camera-preview').style.display = 'none';
        }
    }

    displayCapturedImage(imageSrc) {
        const capturedImage = document.getElementById('captured-image');
        const wineImage = document.getElementById('wine-image');
        const video = document.getElementById('video');
        
        wineImage.src = imageSrc;
        capturedImage.style.display = 'block';
        video.style.display = 'none';
        
        document.getElementById('capture-photo').style.display = 'none';
        
        // Show next step (タグ選択)
        setTimeout(() => this.showStep(2), 500);
    }

    retakePhoto() {
        const capturedImage = document.getElementById('captured-image');
        const video = document.getElementById('video');
        
        capturedImage.style.display = 'none';
        video.style.display = 'block';
        
        // カメラプレビューを非表示にする
        document.getElementById('camera-preview').style.display = 'none';
        document.getElementById('start-camera').style.display = 'inline-block';
        document.getElementById('capture-photo').style.display = 'none';
        
        this.wineImage = null;
        this.hideStep(2);
    }

    handleFlavorSelection(event) {
        const flavor = event.target.value;
        if (event.target.checked) {
            if (!this.selectedFlavors.includes(flavor)) {
                this.selectedFlavors.push(flavor);
            }
        } else {
            this.selectedFlavors = this.selectedFlavors.filter(f => f !== flavor);
        }

        // フレーバー選択状態を更新（カスタムフレーバーも考慮）
        this.updateFlavorSelectionState();
    }

    addCustomFlavor() {
        const input = document.getElementById('custom-flavor');
        const flavor = input.value.trim();
        
        if (!flavor) {
            return;
        }
        
        if (this.customFlavors.includes(flavor)) {
            return;
        }
        
        // カスタムフレーバーを追加
        this.customFlavors.push(flavor);
        
        // UIを更新
        this.updateCustomFlavorsList();
        
        // フレーバー選択状態を更新
        this.updateFlavorSelectionState();
        
        // 入力フィールドをクリア
        input.value = '';
    }
    
    removeCustomFlavor(flavor) {
        this.customFlavors = this.customFlavors.filter(f => f !== flavor);
        this.updateCustomFlavorsList();
        this.updateFlavorSelectionState();
    }
    
    updateCustomFlavorsList() {
        // デスクトップ用のカスタムフレーバーリスト
        const container = document.getElementById('custom-flavors-list');
        if (container) {
            container.innerHTML = '';
            
            this.customFlavors.forEach(flavor => {
                const item = document.createElement('div');
                item.className = 'custom-flavor-item';
                item.innerHTML = `
                    <span>${flavor}</span>
                    <button class="remove-custom" onclick="app.removeCustomFlavor('${flavor}')">×</button>
                `;
                container.appendChild(item);
            });
        }
        
        // モバイル用のカスタムフレーバーリスト
        const mobileContainer = document.getElementById('custom-flavors-list-mobile');
        if (mobileContainer) {
            mobileContainer.innerHTML = '';
            
            this.customFlavors.forEach(flavor => {
                const item = document.createElement('div');
                item.className = 'custom-flavor-item';
                item.innerHTML = `
                    <span>${flavor}</span>
                    <button class="remove-custom" onclick="app.removeCustomFlavor('${flavor}')">×</button>
                `;
                mobileContainer.appendChild(item);
            });
        }
    }
    
    updateFlavorSelectionState() {
        const totalFlavors = this.selectedFlavors.length + this.customFlavors.length;
        const confirmButton = document.getElementById('confirm-flavors');
        
        if (totalFlavors > 0) {
            confirmButton.style.display = 'inline-block';
        } else {
            confirmButton.style.display = 'none';
            this.hideStep(3);
        }
    }
    
    initializeCategoryStates() {
        this.updateCategoryStates();
    }
    
    handleResize() {
        // リサイズ時に状態を更新
        this.updateCategoryStates();
    }
    
    updateCategoryStates() {
        const isMobile = window.innerWidth <= 768;
        
        document.querySelectorAll('.flavor-options').forEach(options => {
            const category = options.getAttribute('data-category');
            const toggle = document.querySelector(`.category-toggle[data-category="${category}"]`);
            
            if (isMobile) {
                // スマホ表示時：デフォルトで折りたたみ状態
                if (!options.classList.contains('expanded')) {
                    options.classList.remove('expanded');
                }
                if (toggle) {
                    toggle.classList.add('collapsed');
                    toggle.textContent = '▶';
                }
            } else {
                // デスクトップ表示時：常に展開状態
                options.classList.add('expanded');
                if (toggle) {
                    toggle.classList.remove('collapsed');
                    toggle.textContent = '▼';
                }
            }
        });
    }
    
    toggleCategory(event) {
        // スマホ表示時のみトグル機能を有効化
        if (window.innerWidth > 768) {
            return;
        }
        
        const toggle = event.target;
        const category = toggle.getAttribute('data-category');
        const flavorOptions = document.querySelector(`.flavor-options[data-category="${category}"]`);
        
        if (!flavorOptions) return;
        
        // トグル状態を切り替え
        const isExpanded = flavorOptions.classList.contains('expanded');
        
        if (isExpanded) {
            // 折りたたみ
            flavorOptions.classList.remove('expanded');
            toggle.classList.add('collapsed');
            toggle.textContent = '▶';
        } else {
            // 展開
            flavorOptions.classList.add('expanded');
            toggle.classList.remove('collapsed');
            toggle.textContent = '▼';
        }
    }

    confirmFlavors() {
        // フレーバー選択を確定
        const totalFlavors = this.selectedFlavors.length + this.customFlavors.length;
        if (totalFlavors === 0) {
            return;
        }
        
        // ステップ3を折りたたむ
        this.collapseStep(3);
        
        // ステップ4（ポエトリー選択）をスキップして、直接テイスティングノート生成に進む
        setTimeout(() => this.generateTastingNotes(), 300);
    }

    // ポエム度合いの変更ハンドラー（一時的にコメントアウト）
    /*
    handlePoetryChange(event) {
        this.poetryLevel = parseInt(event.target.value);
        this.updatePoetryDescription();
        
        // スライダーを動かしても自動的に次のステップに進まない
        // OKボタンで確定するまで待機
    }
    */

    // confirmPoetryメソッド（ステップ4スキップのためコメントアウト）
    /*
    confirmPoetry() {
        // 詩的度合いを確定（デフォルト値でもOK）
        const poetryLevel = this.poetryLevel || 3; // デフォルト値は3
        
        // ステップ4を折りたたむ
        this.collapseStep(4);
        
        // 直接テイスティングノートを生成
        setTimeout(() => this.generateTastingNotes(), 300);
        
    }
    */

    updatePoetryDescription() {
        const descriptions = {
            0: "選択したフレーバーを箇条書きで表示します",
            1: "シンプルで実用的な表現でテイスティングノートを生成します",
            2: "やや詳しく、親しみやすい表現でテイスティングノートを生成します", 
            3: "標準的な表現でテイスティングノートを生成します",
            4: "豊かで感情的な表現でテイスティングノートを生成します",
            5: "詩的で芸術的な表現でテイスティングノートを生成します"
        };
        
        const poetryDescription = document.getElementById('poetry-description');
        if (poetryDescription) {
            poetryDescription.textContent = descriptions[this.poetryLevel];
        }
    }

    // タグとフレーバー選択を無効化
    disableTagAndFlavorSelection() {
        // タグ選択ボタンを無効化
        const tagOptions = document.querySelectorAll('.tag-option');
        tagOptions.forEach(button => {
            button.disabled = true;
            button.style.opacity = '0.5';
            button.style.cursor = 'not-allowed';
        });
        
        // フレーバー選択チェックボックスを無効化
        const flavorCheckboxes = document.querySelectorAll('.flavor-options input[type="checkbox"]');
        flavorCheckboxes.forEach(checkbox => {
            checkbox.disabled = true;
            checkbox.style.opacity = '0.5';
        });
        
        // カスタムフレーバー入力も無効化
        const customFlavorInputs = document.querySelectorAll('#custom-flavor, #mobile-custom-flavor');
        customFlavorInputs.forEach(input => {
            input.disabled = true;
            input.style.opacity = '0.5';
        });
        
        // カスタムフレーバー追加ボタンも無効化
        const addCustomButtons = document.querySelectorAll('#add-custom-flavor, #add-mobile-custom-flavor');
        addCustomButtons.forEach(button => {
            button.disabled = true;
            button.style.opacity = '0.5';
            button.style.cursor = 'not-allowed';
        });
        
        // フレーバー削除ボタンも無効化
        const removeButtons = document.querySelectorAll('.remove-custom-flavor');
        removeButtons.forEach(button => {
            button.disabled = true;
            button.style.opacity = '0.5';
            button.style.cursor = 'not-allowed';
        });
        
        // ナビゲーションボタンを無効化
        const nextButtons = document.querySelectorAll('#next-step, #confirm-flavors');
        nextButtons.forEach(button => {
            button.disabled = true;
            button.style.opacity = '0.5';
            button.style.cursor = 'not-allowed';
        });
    }

    // タグとフレーバー選択を有効化（リセット時用）
    enableTagAndFlavorSelection() {
        // タグ選択ボタンを有効化
        const tagOptions = document.querySelectorAll('.tag-option');
        tagOptions.forEach(button => {
            button.disabled = false;
            button.style.opacity = '1';
            button.style.cursor = 'pointer';
        });
        
        // フレーバー選択チェックボックスを有効化
        const flavorCheckboxes = document.querySelectorAll('.flavor-options input[type="checkbox"]');
        flavorCheckboxes.forEach(checkbox => {
            checkbox.disabled = false;
            checkbox.style.opacity = '1';
        });
        
        // カスタムフレーバー入力も有効化
        const customFlavorInputs = document.querySelectorAll('#custom-flavor, #mobile-custom-flavor');
        customFlavorInputs.forEach(input => {
            input.disabled = false;
            input.style.opacity = '1';
        });
        
        // カスタムフレーバー追加ボタンも有効化
        const addCustomButtons = document.querySelectorAll('#add-custom-flavor, #add-mobile-custom-flavor');
        addCustomButtons.forEach(button => {
            button.disabled = false;
            button.style.opacity = '1';
            button.style.cursor = 'pointer';
        });
        
        // フレーバー削除ボタンも有効化
        const removeButtons = document.querySelectorAll('.remove-custom-flavor');
        removeButtons.forEach(button => {
            button.disabled = false;
            button.style.opacity = '1';
            button.style.cursor = 'pointer';
        });
        
        // ナビゲーションボタンを有効化
        const nextButtons = document.querySelectorAll('#next-step, #confirm-flavors');
        nextButtons.forEach(button => {
            button.disabled = false;
            button.style.opacity = '1';
            button.style.cursor = 'pointer';
        });
    }

    async generateTastingNotes() {
        // 結果セクションを先に表示
        this.showStep(5);
        
        // プログレスバーを表示
        this.showProgress();
        
        // 結果アクションボタンを非表示
        this.hideResultActions();
        
        // 生成開始時にタグとフレーバー選択を無効化
        this.disableTagAndFlavorSelection();

        try {
            const tastingNote = await this.generateWithAIFallback();
            this.hideProgress();
            this.displayTastingNote(tastingNote);
            // 生成完了時に結果アクションボタンを表示
            this.showResultActions();
        } catch (error) {
            console.error('生成エラー:', error);
            this.hideProgress();
            alert('テイスティングノートの生成中にエラーが発生しました。');
            // エラー時も結果アクションボタンを表示
            this.showResultActions();
        }
    }

    async generateWithAIFallback() {
        // プロキシサーバーの接続確認
        const isProxyAvailable = await this.checkProxyServer();
        
        // 設定されたプロバイダーを順番に試行
        const providers = this.apiConfig.providers || ['groq'];
        
        
        // ポエム度合いが0の場合は箇条書きで返す
        if (this.poetryLevel === 0) {
            const allFlavors = [...this.selectedFlavors, ...this.customFlavors];
            const flavorText = allFlavors.length > 0 ? allFlavors.join('、') : '複雑で奥深い香味';
            const drinkType = this.getDrinkTypeForTag(this.currentTag);
            return {
                content: this.generateBulletPointNote(flavorText, drinkType),
                provider: 'bullet-point'
            };
        }
        
        for (const provider of providers) {
            if (provider === 'template') {
                // テンプレート生成
                this.updateProgress(80);
                await new Promise(resolve => setTimeout(resolve, 1000));
                this.updateProgress(100);
                const result = this.generateAdvancedTemplate();
                result.provider = 'template';
                return result;
            }
            
            if (!isProxyAvailable) {
                continue;
            }
            
            try {
                this.updateProgress(30);
                
                const result = await this.callAIProvider(provider);
                if (result && result.content) {
                    this.updateProgress(100);
                    return result;
                } else {
                }
            } catch (error) {
                this.updateProgress(50);
                await new Promise(resolve => setTimeout(resolve, 500));
            }
        }
        
        // 全てのプロバイダーが失敗した場合の最終フォールバック
        this.updateProgress(80);
        await new Promise(resolve => setTimeout(resolve, 1000));
        this.updateProgress(100);
        const result = this.generateAdvancedTemplate();
        result.provider = 'fallback-template';
        return result;
    }

    async checkProxyServer() {
        try {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => {
                controller.abort();
            }, 5000); // 5秒に延長
            
            const startTime = Date.now();
            const response = await fetch(`${this.apiConfig.proxy.baseUrl}/health`, {
                method: 'GET',
                signal: controller.signal,
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }
            });
            
            const endTime = Date.now();
            clearTimeout(timeoutId);
            console.log(`✅ プロキシサーバー応答: ${response.status} ${response.statusText} (${endTime - startTime}ms)`);
            
            if (response.ok) {
                const data = await response.json();
                console.log(`📊 プロキシサーバーレスポンス:`, data);
            }
            
            return response.ok;
        } catch (error) {
            console.log(`❌ プロキシサーバー接続エラー: ${error.name} - ${error.message}`);
            if (error.name === 'AbortError') {
                console.log(`⏰ プロキシサーバー接続タイムアウト (5秒)`);
            } else if (error.name === 'TypeError') {
                console.log(`🌐 ネットワークエラー: プロキシサーバーに接続できません`);
            }
            return false;
        }
    }




    getProviderDisplayName(provider) {
        const names = {
            gemini: 'Google Gemini',
            groq: 'Groq AI',
            cohere: 'Cohere AI',
            template: 'AI風テンプレート'
        };
        return names[provider] || provider;
    }

    // タグに応じた飲み物の種類を取得
    getDrinkTypeForTag(tag) {
        const drinkTypes = {
            'ワイン': 'ワイン',
            'ウイスキー': 'ウイスキー'
        };
        return drinkTypes[tag] || 'ワイン';
    }

    // 現在のタグに応じてタグ選択UIを更新
    updateTagSelectionUI() {
        // 全てのタグボタンからselectedクラスを削除
        const tagOptions = document.querySelectorAll('.tag-option');
        if (tagOptions.length > 0) {
            tagOptions.forEach(button => {
                button.classList.remove('selected');
            });
        }
        
        // 現在のタグのボタンにselectedクラスを追加
        const currentTagButton = document.querySelector(`.tag-option[data-tag="${this.currentTag}"]`);
        if (currentTagButton) {
            currentTagButton.classList.add('selected');
        }
        
        // 現在のタグ表示を更新
        const currentTagDisplay = document.getElementById('current-tag');
        if (currentTagDisplay) {
            currentTagDisplay.textContent = this.currentTag;
        }
        
        // フレーバーオプションを更新
        this.updateFlavorOptions();
    }

    // 箇条書き形式のテイスティングノートを生成
    generateBulletPointNote(flavorText, drinkType) {
        const flavors = flavorText.split('、');
        const allFlavors = [...this.selectedFlavors, ...this.customFlavors];
        
        let content = `【${drinkType}テイスティングノート】\n\n`;
        content += `📝 選択されたフレーバー:\n`;
        
        // フレーバーを箇条書きで表示
        allFlavors.forEach((flavor, index) => {
            content += `• ${flavor}\n`;
        });
        
        return content;
    }

    async callAIProvider(provider) {
        // 選択されたフレーバーとカスタムフレーバーを組み合わせ
        let allFlavors = [...this.selectedFlavors];
        if (this.customFlavors.length > 0) {
            allFlavors = allFlavors.concat(this.customFlavors);
        }
        
        const flavorText = allFlavors.length > 0 
            ? allFlavors.join('、') 
            : '複雑で奥深い香味';
            
        const poetryLevelText = ['箇条書き', 'シンプル', 'やや詳しく', '標準的', '豊かな', '詩的'][this.poetryLevel];
        
        // タグに応じた飲み物の種類を取得
        const drinkType = this.getDrinkTypeForTag(this.currentTag);
        
        // ポエム度合いが0の場合は箇条書きで返す
        if (this.poetryLevel === 0) {
            return {
                content: this.generateBulletPointNote(flavorText, drinkType),
                provider: 'bullet-point'
            };
        }
        
        const prompt = `以下のフレーバーを必ず含めて、${drinkType}のテイスティングノートを書いてください。

【必須フレーバー】: ${flavorText}

要求事項:
1. 上記のフレーバーを必ず文章内で具体的に言及してください
2. ${poetryLevelText}な表現で日本語で書いてください
3. 200文字程度で、エレガントで詩的な表現を使用してください
4. ${drinkType}の特性に合った専門的な表現を使用してください
5. フレーバーの組み合わせや調和についても言及してください

例: 「${flavorText.split('、')[0]}の香りが印象的で...」のように、具体的なフレーバー名を含めてください。`;
        
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), this.apiConfig.proxy.timeout);
        
        try {
            const requestBody = {
                prompt: prompt
            };
            
            // APIキーはプロキシサーバー側で管理
            
            const response = await fetch(`${this.apiConfig.proxy.baseUrl}/${provider}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                signal: controller.signal,
                body: JSON.stringify(requestBody)
            });
            
            clearTimeout(timeoutId);
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const data = await response.json();
            
            // Hugging Faceの場合は英語から日本語風に変換
            let content = data.content;
            if (provider === 'huggingface') {
                content = this.convertEnglishToJapanese(content, flavorText);
            }
            
            return {
                content: content,
                provider: data.provider
            };
            
        } catch (error) {
            clearTimeout(timeoutId);
            throw error;
        }
    }

    convertEnglishToJapanese(englishText, flavorText) {
        // タグに応じた飲み物の種類を取得
        const drinkType = this.getDrinkTypeForTag(this.currentTag);
        
        // フレーバーを具体的に含めたテンプレートを生成
        const flavorArray = flavorText.split('、');
        const primaryFlavor = flavorArray[0];
        const secondaryFlavors = flavorArray.slice(1);
        
        const templates = [
            `この${drinkType}は${primaryFlavor}の香りが印象的で、${secondaryFlavors.length > 0 ? secondaryFlavors.join('、') + 'の調和も美しく、' : ''}${this.poetryLevel >= 4 ? '詩的で芸術的な' : this.poetryLevel >= 3 ? '上品で洗練された' : '親しみやすい'}味わいが特徴です。口に含むと${flavorText}の豊かな風味が広がり、${this.poetryLevel >= 4 ? '魂に響く深い余韻' : this.poetryLevel >= 3 ? '記憶に残る美しい余韻' : '心地よい余韻'}を残します。`,
            `グラスに注がれたこの${drinkType}からは${primaryFlavor}の魅惑的な香りが立ち上がり、${secondaryFlavors.length > 0 ? secondaryFlavors.join('、') + 'の香りも重なり合い、' : ''}${this.poetryLevel >= 4 ? '時を超越した美しさ' : this.poetryLevel >= 3 ? 'エレガントで洗練された品格' : 'バランスの取れた魅力'}を醸し出します。${flavorText}の調和が${this.poetryLevel >= 4 ? '永遠の記憶に刻まれる' : this.poetryLevel >= 3 ? '深い感動を与える' : '楽しい時間を演出する'}逸品です。`,
            `${primaryFlavor}の香りが特徴的なこの${drinkType}は、${secondaryFlavors.length > 0 ? secondaryFlavors.join('、') + 'の風味も加わり、' : ''}${this.poetryLevel >= 4 ? '神々の雫と呼ぶにふさわしい' : this.poetryLevel >= 3 ? `${drinkType}の芸術性を感じさせる` : '食事との相性も良好な'}仕上がりとなっています。${flavorText}の複雑な香りが${this.poetryLevel >= 4 ? '液体の詩そのもの' : this.poetryLevel >= 3 ? '時間をかけて味わいたい深みのある' : '幅広いシーンで楽しめる'}一本です。`
        ];
        
        return templates[Math.floor(Math.random() * templates.length)];
    }

    async generateWithHuggingFace() {
        const flavorText = this.selectedFlavors.length > 0 ? this.selectedFlavors.join('、') : '複雑な香味';
        const poetryLevelText = ['箇条書き', 'シンプル', 'やや詳しく', '標準的', '豊かな', '詩的'][this.poetryLevel];
        
        // タグに応じた飲み物の種類を取得
        const drinkType = this.getDrinkTypeForTag(this.currentTag);
        
        // 英語プロンプトで生成し、後で日本語に変換
        const prompt = `${drinkType} tasting note: This ${drinkType.toLowerCase()} MUST include these specific flavors: ${flavorText.replace(/、/g, ', ')}. Write an elegant ${drinkType.toLowerCase()} tasting note that specifically mentions each flavor:`;

        // 複数のモデルを順番に試行
        for (const modelUrl of this.apiConfig.huggingface.models) {
            try {
                
                const controller = new AbortController();
                const timeoutId = setTimeout(() => controller.abort(), this.apiConfig.huggingface.timeout);
                
                const response = await fetch(modelUrl, {
                    method: 'POST',
                    headers: this.apiConfig.huggingface.headers,
                    signal: controller.signal,
                    body: JSON.stringify({
                        inputs: prompt,
                        parameters: {
                            max_new_tokens: 100,
                            temperature: 0.7,
                            do_sample: true,
                            top_p: 0.9,
                            repetition_penalty: 1.1
                        },
                        options: {
                            wait_for_model: false, // すぐに応答を求める
                            use_cache: true
                        }
                    })
                });
                
                clearTimeout(timeoutId);

                if (!response.ok) {
                    continue;
                }

                const data = await response.json();
                
                if (data.error) {
                    continue;
                }

                const generatedText = data[0]?.generated_text || '';
                let cleanText = generatedText.replace(prompt, '').trim();
                
                // 基本的なクリーニング
                cleanText = cleanText.replace(/\n+/g, ' ').trim();
                
                if (cleanText.length < 20) {
                    continue;
                }

                // 日本語風に変換（簡易版）
                const japaneseText = this.convertToJapaneseStyle(cleanText, flavorText);

                return {
                    content: japaneseText
                };
                
            } catch (error) {
                continue;
            }
        }
        
        // すべてのモデルが失敗した場合
        throw new Error('All Hugging Face models failed');
    }

    convertToJapaneseStyle(englishText, flavorText) {
        // 簡易的な英語→日本語風変換
        const templates = [
            `このワインは${flavorText}の豊かな香りが特徴的です。${this.poetryLevel >= 4 ? '官能的で' : ''}バランスの取れた味わいで、${this.poetryLevel >= 3 ? '洗練された' : '親しみやすい'}仕上がりとなっています。`,
            `グラスに注がれると${flavorText}の魅惑的な香りが立ち上がります。${this.poetryLevel >= 4 ? '詩的で芸術的な' : '心地よい'}味わいが口の中に広がり、${this.poetryLevel >= 3 ? '記憶に残る' : '楽しい'}体験を提供してくれます。`,
            `${flavorText}の香りが印象的なこのワインは、${this.poetryLevel >= 4 ? '時を超えた美しさ' : '上品な魅力'}を持っています。${this.poetryLevel >= 3 ? '深みのある余韻' : '爽やかな後味'}が特徴的です。`
        ];
        
        return templates[Math.floor(Math.random() * templates.length)];
    }

    async generateWithCohere() {
        const flavorText = this.selectedFlavors.length > 0 ? this.selectedFlavors.join('、') : '複雑な香味';
        const poetryLevelText = ['箇条書き', 'シンプル', 'やや詳しく', '標準的', '豊かな', '詩的'][this.poetryLevel];
        
        const prompt = `${flavorText}の香りを持つワインについて、${poetryLevelText}な表現で日本語のテイスティングノートを書いてください。エレガントで詩的な表現を使用し、ワインの特徴を美しく描写してください。`;

        const response = await fetch(this.apiConfig.cohere.url, {
            method: 'POST',
            headers: this.apiConfig.cohere.headers,
            body: JSON.stringify({
                model: 'command',
                prompt: prompt,
                max_tokens: 200,
                temperature: 0.8,
                k: 0,
                stop_sequences: [],
                return_likelihoods: 'NONE'
            })
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        
        if (data.message) {
            throw new Error(data.message);
        }

        const generatedText = data.generations?.[0]?.text?.trim() || '';
        
        if (generatedText.length < 10) {
            throw new Error('生成されたテキストが短すぎます');
        }

        return {
            content: generatedText
        };
    }

    createTastingNote() {
        // Wine characteristics templates based on selected flavors
        const flavorDescriptions = {
            // Fruits
            citrus: ["爽やかな柑橘", "レモンの輝き", "グレープフルーツの苦味", "ライムの鮮烈さ"],
            berry: ["ベリーの甘美", "ブラックベリーの深み", "ラズベリーの酸味", "イチゴの可憐さ"],
            "stone-fruit": ["桃の柔らかさ", "アプリコットの温もり", "プラムの豊潤さ", "チェリーの艶やかさ"],
            tropical: ["パイナップルの南国感", "マンゴーの官能", "パッションフルーツの情熱", "ココナッツの甘い誘惑"],
            
            // Florals
            rose: ["バラの優雅", "薔薇園の香り", "ローズペタルの繊細さ", "花びらの儚さ"],
            violet: ["スミレの可憐", "紫の神秘", "野花の素朴さ", "春の訪れ"],
            jasmine: ["ジャスミンの官能", "夜香木の魅惑", "白い花の純粋さ", "エキゾチックな香り"],
            elderflower: ["エルダーフラワーの清楚", "初夏の風", "白い花房の美しさ", "野生の香り"],
            
            // Spices & Herbs
            pepper: ["胡椒のスパイシー", "ピリッとした刺激", "黒胡椒の力強さ", "スパイスの複雑さ"],
            cinnamon: ["シナモンの温もり", "甘いスパイス", "樽の記憶", "オリエンタルな香り"],
            thyme: ["タイムの野性", "地中海の風", "ハーブの清涼感", "大地の恵み"],
            mint: ["ミントの爽快", "清涼感溢れる", "緑の香り", "森の息吹"],
            
            // Earth & Mineral
            mineral: ["ミネラルの純粋さ", "石の記憶", "大地の鼓動", "テロワールの表現"],
            earth: ["土の温もり", "森の床", "腐葉土の豊かさ", "自然の循環"],
            leather: ["革の重厚感", "時を経た深み", "男性的な力強さ", "職人の技"],
            smoke: ["煙の神秘", "焚き火の記憶", "燻製の香り", "古い樽の物語"],
            
            // Oak & Vanilla
            vanilla: ["バニラの甘美", "樽の恵み", "クリーミーな口当たり", "デザートのような贅沢"],
            toast: ["トーストの香ばしさ", "焼きたてパンの温もり", "樽職人の技", "琥珀色の輝き"],
            caramel: ["キャラメルの甘さ", "糖蜜の深み", "黄金色の誘惑", "舌に残る余韻"],
            chocolate: ["チョコレートの濃厚さ", "カカオの苦味", "ビターな大人の味", "絹のような滑らかさ"]
        };

        // Poetry level templates
        const poetryTemplates = {
            1: {
                opening: ["このワインは", "香りには", "味わいは"],
                structure: "が感じられ、{flavors}が特徴的です。",
                closing: ["バランスの良いワインです。", "飲みやすい仕上がりです。", "食事と合わせやすいでしょう。"]
            },
            2: {
                opening: ["グラスに注がれたこのワインは", "香りを楽しむと", "口に含むと"],
                structure: "が広がり、{flavors}が心地よく調和しています。",
                closing: ["とても魅力的なワインです。", "記憶に残る一本でしょう。", "特別な時間を演出してくれます。"]
            },
            3: {
                opening: ["グラスの中で輝くこのワインは", "芳醇な香りには", "繊細な味わいには"],
                structure: "が漂い、{flavors}が見事に溶け合っています。",
                closing: ["エレガントで印象深いワインです。", "洗練された味わいを楽しめます。", "時間をかけて味わいたい一本です。"]
            },
            4: {
                opening: ["琥珀色に輝くこのワインは", "魅惑的な香りには", "官能的な味わいには"],
                structure: "が踊るように香り立ち、{flavors}が情熱的に絡み合います。",
                closing: ["心を揺さぶる芸術的なワインです。", "感動的な体験を約束してくれます。", "魂に響く深い余韻を残します。"]
            },
            5: {
                opening: ["液体の宝石のように輝くこのワインは", "天上の香りには", "詩的な味わいには"],
                structure: "が舞い踊り、{flavors}が愛の歌を奏でるように調和します。",
                closing: ["まさに神々の雫と呼ぶにふさわしい逸品です。", "永遠の記憶に刻まれる至高の体験です。", "時を超えて語り継がれる芸術作品です。"]
            }
        };

        // Generate flavor descriptions based on selections
        let flavorTexts = [];
        this.selectedFlavors.forEach(flavor => {
            if (flavorDescriptions[flavor]) {
                const options = flavorDescriptions[flavor];
                const randomDesc = options[Math.floor(Math.random() * options.length)];
                flavorTexts.push(randomDesc);
            }
        });

        // Build the tasting note
        const template = poetryTemplates[this.poetryLevel];
        const opening = template.opening[Math.floor(Math.random() * template.opening.length)];
        const closing = template.closing[Math.floor(Math.random() * template.closing.length)];
        
        let flavorString = "";
        if (flavorTexts.length > 0) {
            if (flavorTexts.length === 1) {
                flavorString = flavorTexts[0];
            } else if (flavorTexts.length === 2) {
                flavorString = flavorTexts.join("と");
            } else {
                flavorString = flavorTexts.slice(0, -1).join("、") + "、そして" + flavorTexts[flavorTexts.length - 1];
            }
        } else {
            flavorString = "複雑で奥深い香味";
        }

        const body = template.structure.replace("{flavors}", flavorString);
        
        return {
            title: "テイスティングノート",
            content: `${opening}${body}\n\n${closing}`,
            provider: "テンプレートベース"
        };
    }

    displayTastingNote(note) {
        const noteElement = document.getElementById('tasting-note');
        
        // コンソールログに生成方法を表示
        console.log('=== テイスティングノート生成完了 ===');
        if (note.provider) {
            const providerNames = {
                'gemini': 'Google Gemini',
                'groq': 'Groq AI',
                'cohere': 'Cohere AI',
                'huggingface': 'Hugging Face',
                'template': 'AI風テンプレート',
                'fallback-template': 'テンプレートベース (フォールバック)',
                'bullet-point': '箇条書き形式'
            };
            const providerDisplayName = providerNames[note.provider] || note.provider;
            console.log(`🤖 使用AI: ${providerDisplayName} (${note.provider})`);
        } else {
            console.log('🤖 使用AI: テンプレートベース (フォールバック)');
        }
        console.log(`🏷️ 選択タグ: ${this.currentTag}`);
        console.log(`🍋 選択フレーバー: ${this.selectedFlavors.join(', ') || 'なし'}`);
        console.log(`✏️ カスタムフレーバー: ${this.customFlavors.join(', ') || 'なし'}`);
        console.log(`📝 ポエトリーレベル: ${this.poetryLevel} (${['箇条書き', 'シンプル', 'やや詳しく', '標準的', '豊かな', '詩的'][this.poetryLevel]})`);
        console.log(`📄 生成文字数: ${note.content.length}文字`);
        console.log('=====================================');
        
        // 箇条書き形式の場合は改行を適切に処理
        if (note.provider === 'bullet-point') {
            noteElement.innerHTML = `
                <div style="white-space: pre-line; font-family: monospace; line-height: 1.6;">${note.content}</div>
            `;
        } else {
            noteElement.innerHTML = `
                <p>${note.content.replace(/\n\n/g, '</p><p>')}</p>
            `;
        }
        noteElement.classList.add('animate-in');
    }


    generateAdvancedTemplate() {
        const flavorProfiles = this.buildFlavorProfile();
        const drinkCharacteristics = this.generateDrinkCharacteristics();
        const poeticElements = this.generatePoeticElements();
        
        const structure = this.selectNoteStructure();
        
        // 選択されたフレーバーを具体的に含める
        const allFlavors = [...this.selectedFlavors, ...this.customFlavors];
        const flavorText = allFlavors.length > 0 ? allFlavors.join('、') : '複雑で奥深い香味';
        
        let content = structure.opening;
        content += `${flavorText}の香りが印象的な${flavorProfiles.aromaDescription}。`;
        content += structure.transition;
        content += `${flavorText}の風味が調和した${flavorProfiles.tasteDescription}。`;
        content += structure.finish;
        content += `${flavorText}の余韻が美しく残る${poeticElements.conclusion}。`;
        
        return {
            content: content
        };
    }

    buildFlavorProfile() {
        const selectedCategories = this.categorizeSelectedFlavors();
        let aromaElements = [];
        let tasteElements = [];
        
        // より詳細なフレーバー記述を生成
        Object.keys(selectedCategories).forEach(category => {
            const flavors = selectedCategories[category];
            if (flavors.length > 0) {
                const categoryDesc = this.generateCategoryDescription(category, flavors);
                aromaElements.push(categoryDesc.aroma);
                tasteElements.push(categoryDesc.taste);
            }
        });
        
        // カスタムフレーバーを追加（より自然に組み込む）
        if (this.customFlavors.length > 0) {
            const customDesc = this.generateCustomFlavorDescription();
            if (customDesc.aroma) {
                aromaElements.push(customDesc.aroma);
            }
            if (customDesc.taste) {
                tasteElements.push(customDesc.taste);
            }
        }
        
        // フレーバーが選択されていない場合のデフォルト
        if (aromaElements.length === 0) {
            aromaElements.push(this.getDefaultAromaDescription());
            tasteElements.push(this.getDefaultTasteDescription());
        }
        
        // 選択されたフレーバーを具体的に含める
        const allFlavors = [...this.selectedFlavors, ...this.customFlavors];
        const flavorText = allFlavors.length > 0 ? allFlavors.join('、') : '';
        
        let aromaDescription = this.combineDescriptions(aromaElements, 'aroma');
        let tasteDescription = this.combineDescriptions(tasteElements, 'taste');
        
        // フレーバーが選択されている場合は、具体的なフレーバー名を含める
        if (flavorText) {
            aromaDescription = `${flavorText}の香りが特徴的な${aromaDescription}`;
            tasteDescription = `${flavorText}の風味が調和した${tasteDescription}`;
        }
        
        return {
            aromaDescription: aromaDescription,
            tasteDescription: tasteDescription
        };
    }
    
    generateCustomFlavorDescription() {
        if (this.customFlavors.length === 0) {
            return { aroma: '', taste: '' };
        }
        
        const customFlavors = this.customFlavors.join('、');
        const isMultiple = this.customFlavors.length > 1;
        
        // より自然で多様な表現を生成（単数・複数に対応）
        const aromaTemplates = [
            `魅力的な${customFlavors}の香りが鼻をくすぐり`,
            `上品な${customFlavors}の香りが漂い`,
            `印象的な${customFlavors}の香りが立ち上り`,
            `繊細な${customFlavors}の香りが感じられ`,
            `豊かな${customFlavors}の香りが広がり`,
            `${customFlavors}の${isMultiple ? '複雑な' : '独特な'}香りが印象的で`,
            `微かに${customFlavors}の香りが感じられ`,
            `${customFlavors}の${isMultiple ? '調和した' : '上質な'}香りが漂い`
        ];
        
        const tasteTemplates = [
            `口の中で${customFlavors}の風味がじっくりと広がり`,
            `${customFlavors}の味わいが口いっぱいに広がり`,
            `舌の上で${customFlavors}の風味が踊り`,
            `${customFlavors}の複雑な味わいが感じられ`,
            `後味に${customFlavors}の余韻が残り`,
            `${customFlavors}の${isMultiple ? '調和した' : '豊かな'}風味が口の中で展開し`,
            `じっくりと${customFlavors}の味わいが感じられ`,
            `${customFlavors}の${isMultiple ? '多層的な' : '深い'}味わいが印象的で`
        ];
        
        // ランダムに選択して多様性を持たせる
        const aroma = aromaTemplates[Math.floor(Math.random() * aromaTemplates.length)];
        const taste = tasteTemplates[Math.floor(Math.random() * tasteTemplates.length)];
        
        return { aroma, taste };
    }

    categorizeSelectedFlavors() {
        const categories = {
            fruits: [],
            florals: [],
            spices: [],
            earth: [],
            oak: []
        };
        
        const flavorCategories = {
            citrus: 'fruits', berry: 'fruits', 'stone-fruit': 'fruits', tropical: 'fruits',
            rose: 'florals', violet: 'florals', jasmine: 'florals', elderflower: 'florals',
            pepper: 'spices', cinnamon: 'spices', thyme: 'spices', mint: 'spices',
            mineral: 'earth', earth: 'earth', leather: 'earth', smoke: 'earth',
            vanilla: 'oak', toast: 'oak', caramel: 'oak', chocolate: 'oak'
        };
        
        this.selectedFlavors.forEach(flavor => {
            const category = flavorCategories[flavor];
            if (category) {
                categories[category].push(flavor);
            }
        });
        
        return categories;
    }

    generateCategoryDescription(category, flavors) {
        const descriptions = {
            fruits: {
                aroma: [
                    "フレッシュな果実の香りが鮮やかに立ち上がり",
                    "豊潤な果実のブーケが優雅に漂い",
                    "生き生きとした果実の芳香が心を躍らせ"
                ],
                taste: [
                    "果実味が口中に溢れるように広がり",
                    "ジューシーな果実感が舌を包み込み",
                    "瑞々しい果実の風味が調和して"
                ]
            },
            florals: {
                aroma: [
                    "花々の優美な香りが繊細に舞い踊り",
                    "エレガントな花の香りが空気を満たし",
                    "可憐な花の芳香が詩的に響き"
                ],
                taste: [
                    "花のような上品な風味が口の中に咲き",
                    "フローラルな余韻が美しく続き",
                    "花びらのような繊細さが感じられ"
                ]
            },
            spices: {
                aroma: [
                    "スパイシーな香りが複雑に絡み合い",
                    "香辛料の豊かなアロマが深みを演出し",
                    "エキゾチックなスパイスの香りが魅惑的に"
                ],
                taste: [
                    "スパイスの温もりが口中に広がり",
                    "香辛料の刺激が心地よいアクセントとなり",
                    "スパイシーな余韻が印象的に"
                ]
            },
            earth: {
                aroma: [
                    "大地の恵みを思わせる深い香りが",
                    "テロワールの表現が力強く香り立ち",
                    "土壌の記憶が神秘的に漂い"
                ],
                taste: [
                    "ミネラル感が骨格を形成し",
                    "大地の力強さが味わいに深みを与え",
                    "テロワールの個性が見事に表現され"
                ]
            },
            oak: {
                aroma: [
                    "樽由来の芳醇な香りが贅沢に",
                    "オークの恵みが上品に香り立ち",
                    "樽熟成の証が気高く"
                ],
                taste: [
                    "樽の風味が味わいに奥行きを与え",
                    "オークのタンニンが構造を支え",
                    "樽熟成の恩恵が口中に"
                ]
            }
        };
        
        const categoryDescs = descriptions[category];
        return {
            aroma: categoryDescs.aroma[Math.floor(Math.random() * categoryDescs.aroma.length)],
            taste: categoryDescs.taste[Math.floor(Math.random() * categoryDescs.taste.length)]
        };
    }

    getDefaultAromaDescription() {
        const defaults = [
            "複雑で奥深い香りが神秘的に立ち上がり",
            "多層的なアロマが魅惑的に漂い",
            "洗練された香りの調べが優雅に響き"
        ];
        return defaults[Math.floor(Math.random() * defaults.length)];
    }

    getDefaultTasteDescription() {
        const defaults = [
            "バランスの取れた味わいが口中に広がり",
            "調和のとれた風味が舌を満たし",
            "完璧な均衡が美しく表現され"
        ];
        return defaults[Math.floor(Math.random() * defaults.length)];
    }

    combineDescriptions(elements, type) {
        if (elements.length === 1) {
            return elements[0];
        } else if (elements.length === 2) {
            return elements.join('、');
        } else {
            return elements.slice(0, -1).join('、') + '、そして' + elements[elements.length - 1];
        }
    }

    generateDrinkCharacteristics() {
        const characteristics = [];
        const drinkType = this.getDrinkTypeForTag(this.currentTag);
        
        // ポエム度に応じた特徴
        if (this.poetryLevel >= 4) {
            characteristics.push('時を超越した美しさ');
            characteristics.push('魂を揺さぶる深遠さ');
        } else if (this.poetryLevel >= 3) {
            characteristics.push('洗練された品格');
            characteristics.push('上質な仕上がり');
        } else {
            characteristics.push('親しみやすい魅力');
            characteristics.push('バランスの良さ');
        }
        
        return characteristics;
    }

    generatePoeticElements() {
        const poetryLevel = this.poetryLevel;
        const drinkType = this.getDrinkTypeForTag(this.currentTag);
        
        const conclusions = {
            1: [
                `飲みやすく、食事との相性も良好です`,
                `バランスが良く、幅広いシーンで楽しめます`,
                `親しみやすい味わいで、${drinkType}初心者にもおすすめです`
            ],
            2: [
                `心地よい余韻が印象に残る、魅力的な一本です`,
                `丁寧な造りが感じられる、品質の高い${drinkType}です`,
                `特別な時間を演出してくれる、記憶に残る${drinkType}です`
            ],
            3: [
                `エレガントで洗練された、真の品格を持つ${drinkType}です`,
                `時間をかけて味わいたい、深みのある逸品です`,
                `${drinkType}の芸術性を感じさせる、見事な仕上がりです`
            ],
            4: [
                `心を揺さぶる感動的な体験を約束する、芸術的な${drinkType}です`,
                `魂に響く深い余韻を残す、詩的で官能的な逸品です`,
                `時の流れを忘れさせる、至福のひとときを演出します`
            ],
            5: [
                `神々の雫と呼ぶにふさわしい、天上の美酒です`,
                `永遠の記憶に刻まれる、この世のものとは思えない至高の体験です`,
                `時を超えて語り継がれる、まさに液体の詩そのものです`
            ]
        };
        
        const levelConclusions = conclusions[poetryLevel] || conclusions[3];
        
        return {
            conclusion: levelConclusions[Math.floor(Math.random() * levelConclusions.length)]
        };
    }

    selectNoteStructure() {
        const drinkType = this.getDrinkTypeForTag(this.currentTag);
        
        const structures = [
            {
                opening: `グラスの中で輝くこの${drinkType}は、`,
                transition: "口に含むと、",
                finish: "余韻には"
            },
            {
                opening: `深い色合いを湛えたこの${drinkType}からは、`,
                transition: "味わいは",
                finish: "フィニッシュは"
            },
            {
                opening: `エレガントな佇まいを見せるこの${drinkType}は、`,
                transition: "パレットには",
                finish: "最後に"
            }
        ];
        
        return structures[Math.floor(Math.random() * structures.length)];
    }


    async copyToClipboard() {
        const noteText = document.getElementById('tasting-note').innerText;
        try {
            await navigator.clipboard.writeText(noteText);
            const copyBtn = document.getElementById('copy-note');
            const originalText = copyBtn.textContent;
            copyBtn.textContent = 'コピー完了!';
            setTimeout(() => {
                copyBtn.textContent = originalText;
            }, 2000);
        } catch (error) {
            console.error('クリップボードへのコピーに失敗:', error);
            alert('クリップボードへのコピーに失敗しました。');
        }
    }

    startOver() {
        // 保存されていないノートがあるかチェック
        if (this.hasUnsavedNote()) {
            const confirmReset = confirm('保存されていないテイスティングノートがあります。\n\n本当に最初からやり直しますか？\n\n※保存されていないノートは失われます。');
            if (!confirmReset) {
                return; // ユーザーがキャンセルした場合は何もしない
            }
        }
        
        // Reset all data (currentTagは保持)
        this.wineImage = null;
        this.selectedFlavors = [];
        this.customFlavors = [];
        this.poetryLevel = 3;
        // this.currentTag は最後に選択したタグを保持
        
        // Stop camera if running
        const video = document.getElementById('video');
        if (video.srcObject) {
            const tracks = video.srcObject.getTracks();
            tracks.forEach(track => track.stop());
            video.srcObject = null;
        }
        
        // Reset camera UI to initial state（安全にアクセス）
        const capturedImage = document.getElementById('captured-image');
        if (capturedImage && capturedImage.style) {
            capturedImage.style.display = 'none';
        }
        
        const cameraPreview = document.getElementById('camera-preview');
        if (cameraPreview && cameraPreview.style) {
            cameraPreview.style.display = 'none';  // 白い枠を非表示
        }
        
        // video要素の表示設定（既に宣言済みの変数を使用）
        if (video && video.style) {
            video.style.display = 'block';
        }
        
        const startCamera = document.getElementById('start-camera');
        if (startCamera && startCamera.style) {
            startCamera.style.display = 'inline-block';
        }
        
        const capturePhoto = document.getElementById('capture-photo');
        if (capturePhoto && capturePhoto.style) {
            capturePhoto.style.display = 'none';
        }
        
        // Clear file input
        const fileInput = document.getElementById('file-input');
        if (fileInput) {
            fileInput.value = '';
        }
        
        // Uncheck all flavors (desktop)
        document.querySelectorAll('.flavor-options input[type="checkbox"]').forEach(checkbox => {
            checkbox.checked = false;
        });
        
        // Uncheck all flavors (mobile)
        document.querySelectorAll('.mobile-flavor-grid input[type="checkbox"]').forEach(checkbox => {
            checkbox.checked = false;
        });
        
        // Clear custom flavors
        this.customFlavors = [];
        this.updateCustomFlavorsList();
        
        // Clear custom flavor inputs
        const customInput = document.getElementById('custom-flavor');
        const mobileCustomInput = document.getElementById('custom-flavor-mobile');
        if (customInput) {
            customInput.value = '';
        }
        if (mobileCustomInput) {
            mobileCustomInput.value = '';
        }
        
        // Hide confirm buttons（安全にアクセス）
        const confirmFlavors = document.getElementById('confirm-flavors');
        if (confirmFlavors && confirmFlavors.style) {
            confirmFlavors.style.display = 'none';
        }
        
        // confirm-poetry要素はコメントアウト済みのためスキップ
        // const confirmPoetry = document.getElementById('confirm-poetry');
        // if (confirmPoetry && confirmPoetry.style) {
        //     confirmPoetry.style.display = 'inline-block';
        // }
        
        // Reset poetry slider（安全にアクセス）
        const poetryRange = document.getElementById('poetry-range');
        if (poetryRange) {
            poetryRange.value = 3;
        }
        this.updatePoetryDescription();
        
        // Clear tasting note content but preserve progress container
        const tastingNote = document.getElementById('tasting-note');
        if (tastingNote) {
            // プログレスバーのコンテナを保持するために、生成されたコンテンツのみを削除
            const progressContainer = document.getElementById('progress-container');
            if (progressContainer) {
                // プログレスバー以外のコンテンツを削除
                const children = Array.from(tastingNote.children);
                children.forEach(child => {
                    if (child.id !== 'progress-container') {
                        child.remove();
                    }
                });
            } else {
                // プログレスバーがない場合は完全にクリア
                tastingNote.innerHTML = '';
            }
        }
        
        // Hide all steps except first
        for (let i = 2; i <= 5; i++) {
            this.hideStep(i);
        }
        
        // Reset toggle buttons
        for (let i = 1; i <= 4; i++) {
            const toggleButton = document.getElementById(`toggle-step-${i}`);
            const stepContent = document.getElementById(`step-content-${i}`);
            if (toggleButton && stepContent) {
                toggleButton.style.display = 'none';
                stepContent.classList.remove('collapsed');
                toggleButton.textContent = '▼';
                toggleButton.classList.remove('collapsed');
            }
        }
        
        // Show first step
        this.showStep(1);
        
        // 現在のタグに応じてUIを更新
        this.updateTagSelectionUI();
        
        // タグとフレーバー選択を有効化
        this.enableTagAndFlavorSelection();
        
        // Reset current step
        this.currentStep = 1;
        
        // Scroll to top
        window.scrollTo({ top: 0, behavior: 'smooth' });
        
        console.log('完全リセット完了');
    }




    showStep(stepNumber) {
        const sections = {
            1: 'upload-section',
            2: 'tag-section',      // ステップ2: タグ選択
            3: 'flavor-section',   // ステップ3: フレーバー選択
            4: 'poetry-section',   // ステップ4: ポエトリー選択（コメントアウト済み）
            5: 'results-section'   // ステップ5: 結果表示
        };
        
        const sectionId = sections[stepNumber];
        if (sectionId) {
            const section = document.getElementById(sectionId);
            if (section && section.style) {
                section.style.display = 'block';
                section.scrollIntoView({ behavior: 'smooth', block: 'center' });
            } else {
                console.warn(`セクション ${sectionId} が見つからないか、styleプロパティにアクセスできません`);
            }
        } else {
            console.warn(`ステップ ${stepNumber} に対応するセクションIDが見つかりません`);
        }
    }

    hideStep(stepNumber) {
        const sections = {
            1: 'upload-section',
            2: 'tag-section',      // ステップ2: タグ選択
            3: 'flavor-section',   // ステップ3: フレーバー選択
            4: 'poetry-section',   // ステップ4: ポエトリー選択（コメントアウト済み）
            5: 'results-section'   // ステップ5: 結果表示
        };
        
        const sectionId = sections[stepNumber];
        if (sectionId) {
            const section = document.getElementById(sectionId);
            if (section && section.style) {
                section.style.display = 'none';
            } else {
                console.warn(`セクション ${sectionId} が見つからないか、styleプロパティにアクセスできません`);
            }
        } else {
            console.warn(`ステップ ${stepNumber} に対応するセクションIDが見つかりません`);
        }
    }

    // 設定関連のメソッド
    initSettings() {
        this.settings = {
            providers: ['gemini', 'groq'],
            defaultPoetryLevel: 3
        };
    }

    loadSettings() {
        const savedSettings = localStorage.getItem('flavorVerseSettings');
        if (savedSettings) {
            this.settings = { ...this.settings, ...JSON.parse(savedSettings) };
        }
        
        // UIに反映（要素が存在する場合のみ）
        const enableGemini = document.getElementById('enableGemini');
        const enableGroq = document.getElementById('enableGroq');
        const defaultPoetryLevel = document.getElementById('defaultPoetryLevel');
        const poetryLevelValue = document.getElementById('poetryLevelValue');
        
        if (enableGemini) enableGemini.checked = this.settings.providers.includes('gemini');
        if (enableGroq) enableGroq.checked = this.settings.providers.includes('groq');
        if (defaultPoetryLevel) defaultPoetryLevel.value = this.settings.defaultPoetryLevel;
        if (poetryLevelValue) poetryLevelValue.textContent = this.settings.defaultPoetryLevel;
        
        // API設定を更新
        this.apiConfig.providers = this.settings.providers;
        
    }






    skipPhoto() {
        // 写真なしで進む
        this.wineImage = null;
        
        // カメラを停止
        const video = document.getElementById('video');
        if (video.srcObject) {
            const tracks = video.srcObject.getTracks();
            tracks.forEach(track => track.stop());
            video.srcObject = null;
        }
        
        // UIをリセット
        document.getElementById('camera-preview').style.display = 'none';
        document.getElementById('captured-image').style.display = 'none';
        document.getElementById('start-camera').style.display = 'inline-block';
        document.getElementById('capture-photo').style.display = 'none';
        
        // ステップ1を折りたたむ
        this.collapseStep(1);
        
        // ステップ2（タグ選択）に進む
        this.currentStep = 2;
        this.showStep(2);
        
    }

    toggleStep(stepNumber) {
        const toggleButton = document.getElementById(`toggle-step-${stepNumber}`);
        const stepContent = document.getElementById(`step-content-${stepNumber}`);
        
        if (stepContent.classList.contains('collapsed')) {
            // 展開
            stepContent.classList.remove('collapsed');
            toggleButton.textContent = '▼';
            toggleButton.classList.remove('collapsed');
        } else {
            // 折りたたみ
            stepContent.classList.add('collapsed');
            toggleButton.textContent = '▶';
            toggleButton.classList.add('collapsed');
        }
    }

    collapseStep(stepNumber) {
        const toggleButton = document.getElementById(`toggle-step-${stepNumber}`);
        const stepContent = document.getElementById(`step-content-${stepNumber}`);
        
        // トグルボタンを表示
        toggleButton.style.display = 'flex';
        
        // ステップを折りたたみ
        stepContent.classList.add('collapsed');
        toggleButton.textContent = '▶';
        toggleButton.classList.add('collapsed');
    }

    expandStep(stepNumber) {
        const toggleButton = document.getElementById(`toggle-step-${stepNumber}`);
        const stepContent = document.getElementById(`step-content-${stepNumber}`);
        
        // ステップを展開
        stepContent.classList.remove('collapsed');
        toggleButton.textContent = '▼';
        toggleButton.classList.remove('collapsed');
        
        // ステップ2の場合はOKボタンの状態を更新
        if (stepNumber === 2) {
            const confirmButton = document.getElementById('confirm-flavors');
            if (this.selectedFlavors.length > 0) {
                confirmButton.style.display = 'inline-block';
            } else {
                confirmButton.style.display = 'none';
            }
        }
        
        // ステップ3の場合はOKボタンを常に表示（デフォルト値でもOKできるように）
        if (stepNumber === 3) {
            const confirmButton = document.getElementById('confirm-poetry');
            confirmButton.style.display = 'inline-block';
        }
    }

    showNotification(message, type = 'info') {
        // 簡単な通知システム
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${type === 'success' ? '#28a745' : '#007bff'};
            color: white;
            padding: 15px 20px;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.3);
            z-index: 10000;
            animation: slideInRight 0.3s ease-out;
        `;
        notification.textContent = message;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.animation = 'slideOutRight 0.3s ease-in';
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 3000);
    }
    
    // プログレスバーの制御
    showProgress() {
        const tastingNote = document.getElementById('tasting-note');
        let progressContainer = document.getElementById('progress-container');
        
        // プログレスバーのコンテナが存在しない場合は作成
        if (!progressContainer && tastingNote) {
            progressContainer = document.createElement('div');
            progressContainer.id = 'progress-container';
            progressContainer.style.display = 'none';
            progressContainer.innerHTML = `
                <div class="progress-icon">🍷</div>
                <div class="progress-bar">
                    <div class="progress-fill" id="progress-fill"></div>
                </div>
                <div class="progress-text" id="progress-text">生成中...</div>
            `;
            tastingNote.appendChild(progressContainer);
        }
        
        const progressFill = document.getElementById('progress-fill');
        const progressText = document.getElementById('progress-text');
        
        if (progressContainer) {
            progressContainer.style.display = 'block';
        }
        
        if (progressFill) {
            progressFill.style.width = '0%';
        }
        
        if (progressText) {
            progressText.textContent = '生成中...';
        }
    }
    
    updateProgress(percentage, text) {
        const progressFill = document.getElementById('progress-fill');
        const progressText = document.getElementById('progress-text');
        
        if (progressFill) {
            progressFill.style.width = `${percentage}%`;
        }
        
        if (progressText) {
            progressText.textContent = '生成中...'; // 常に「生成中...」で統一
        }
    }
    
    hideProgress() {
        const progressContainer = document.getElementById('progress-container');
        
        if (progressContainer) {
            setTimeout(() => {
                progressContainer.style.display = 'none';
            }, 500); // 少し遅延して完了状態を見せる
        }
    }
    
    // テイスティングノートの保存
    async saveTastingNote() {
        console.log('=== 保存機能開始 ===');
        
        const tastingNoteElement = document.getElementById('tasting-note');
        console.log('テイスティングノート要素:', tastingNoteElement);
        
        if (!tastingNoteElement || !tastingNoteElement.textContent.trim()) {
            console.log('テイスティングノートがありません');
            alert('保存するテイスティングノートがありません。');
            return;
        }

        console.log('テイスティングノート内容:', tastingNoteElement.textContent.trim());

        // タグは既に選択済み（ステップ2で選択）
        const tag = this.currentTag || 'ワイン';
        console.log('使用するタグ:', tag);

        try {
            console.log('保存処理開始');
            
            // 保存ボタンを無効化してローディング状態にする
            const saveButton = document.getElementById('save-note');
            const originalText = saveButton.textContent;
            const originalBgColor = saveButton.style.backgroundColor;
            saveButton.disabled = true;
            saveButton.textContent = '💾 保存中...';
            saveButton.style.backgroundColor = '#6c757d';

            console.log('現在のフレーバー:', this.selectedFlavors, this.customFlavors);
            console.log('ワイン画像:', this.wineImage);

            let compressedImage = null;
            if (this.wineImage) {
                console.log('画像を圧縮中...');
                compressedImage = await this.compressImage(this.wineImage);
                console.log('画像圧縮完了:', compressedImage ? '成功' : '失敗');
                if (compressedImage) {
                    console.log('Base64画像の長さ:', compressedImage.length);
                }
            }

            const noteData = {
                id: Date.now().toString(),
                content: tastingNoteElement.textContent.trim(),
                image: compressedImage,
                tag: tag,
                createdAt: new Date().toISOString(),
                flavors: [...this.selectedFlavors, ...this.customFlavors]
            };

            console.log('保存するノートデータ:', noteData);

            this.savedNotes.push(noteData);
            console.log('保存後のノート数:', this.savedNotes.length);
            
            this.saveToLocalStorage();
            console.log('ローカルストレージ保存完了');
            
            // 保存成功メッセージ
            saveButton.textContent = '✅ 保存完了！';
            saveButton.style.backgroundColor = '#28a745';
            
            console.log('テイスティングノートを保存しました:', noteData);
            
            // 2秒後に一覧ページに遷移
            setTimeout(() => {
                console.log('一覧ページに遷移');
                this.showPage('list');
                this.displayNotesList();
                
                // ボタンを元に戻す
                saveButton.textContent = originalText;
                saveButton.disabled = false;
                saveButton.style.backgroundColor = '';
            }, 2000);
        } catch (error) {
            console.error('保存エラー:', error);
            
            // エラー時のボタン復元
            const saveButton = document.getElementById('save-note');
            saveButton.disabled = false;
            saveButton.textContent = '保存';
            saveButton.style.backgroundColor = '';
            
            // エラーの種類に応じたメッセージ
            let errorMessage = '保存中にエラーが発生しました。';
            if (error.name === 'QuotaExceededError') {
                errorMessage = 'ストレージの容量が不足しています。古いデータを削除してください。';
            } else if (error.name === 'SecurityError') {
                errorMessage = 'プライベートモードでは保存できません。通常モードでお試しください。';
            }
            
            alert(errorMessage);
        }
    }

    // タグ選択

    // 画像圧縮（Base64形式で保存）
    async compressImage(file) {
        return new Promise((resolve) => {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            const img = new Image();
            
            img.onload = () => {
                const maxWidth = 300;
                const maxHeight = 300;
                let { width, height } = img;
                
                if (width > height) {
                    if (width > maxWidth) {
                        height = (height * maxWidth) / width;
                        width = maxWidth;
                    }
                } else {
                    if (height > maxHeight) {
                        width = (width * maxHeight) / height;
                        height = maxHeight;
                    }
                }
                
                canvas.width = width;
                canvas.height = height;
                ctx.drawImage(img, 0, 0, width, height);
                
                // Base64形式で返す
                const base64 = canvas.toDataURL('image/jpeg', 0.8);
                resolve(base64);
            };
            
            img.onerror = () => {
                console.error('画像の読み込みに失敗しました');
                resolve(null);
            };
            
            img.src = URL.createObjectURL(file);
        });
    }

    // ローカルストレージに保存
    saveToLocalStorage() {
        try {
            const dataToSave = JSON.stringify(this.savedNotes);
            localStorage.setItem('flavorVerse_notes', dataToSave);
            console.log('ローカルストレージに保存完了:', this.savedNotes.length, '件のノート');
        } catch (error) {
            console.error('ローカルストレージ保存エラー:', error);
            
            // エラーの種類に応じた処理
            if (error.name === 'QuotaExceededError') {
                // 古いデータを削除して再試行
                this.cleanOldNotes();
                try {
                    localStorage.setItem('flavorVerse_notes', JSON.stringify(this.savedNotes));
                    console.log('古いデータを削除して再保存完了');
                } catch (retryError) {
                    console.error('再保存も失敗:', retryError);
                    throw retryError;
                }
            } else {
                throw error;
            }
        }
    }

    // 古いノートを削除（容量不足時の対処）
    cleanOldNotes() {
        if (this.savedNotes.length > 50) {
            // 古い順に削除（IDが小さいものから削除）
            this.savedNotes.sort((a, b) => parseInt(a.id) - parseInt(b.id));
            this.savedNotes = this.savedNotes.slice(-30); // 最新30件を保持
            console.log('古いノートを削除しました。現在の保存数:', this.savedNotes.length);
        }
    }

    // テスト用：保存機能のテスト
    testSaveFunction() {
        console.log('=== 保存機能テスト開始 ===');
        
        // テスト用のテイスティングノートを作成
        const testNote = `
【テスト用テイスティングノート】

このワインは美しいルビー色をしており、熟したチェリーとプラムの香りが印象的です。
口当たりは滑らかで、タンニンは柔らかく、バランスの取れた酸味が特徴的です。
余韻は長く、スパイシーなニュアンスが楽しめます。

総合評価：★★★★☆
        `;
        
        // テスト用の要素を作成
        const tastingNoteElement = document.getElementById('tasting-note');
        if (tastingNoteElement) {
            tastingNoteElement.textContent = testNote;
            console.log('テスト用テイスティングノートを設定しました');
            
            // テスト用のフレーバーを設定
            this.selectedFlavors = ['チェリー', 'プラム', 'スパイス'];
            this.customFlavors = ['テストフレーバー'];
            this.poetryLevel = 3;
            
            // テスト用の画像を作成（小さなテスト画像）
            this.createTestImage();
            
            // 結果セクションを表示
            const resultsSection = document.getElementById('results-section');
            if (resultsSection) {
                resultsSection.style.display = 'block';
                console.log('結果セクションを表示しました');
            }
            
            console.log('テスト用データを設定しました');
            console.log('保存ボタンをクリックしてテストしてください');
        } else {
            console.error('テイスティングノート要素が見つかりません');
        }
    }

    // テスト用画像を作成
    createTestImage() {
        const canvas = document.createElement('canvas');
        canvas.width = 200;
        canvas.height = 200;
        const ctx = canvas.getContext('2d');
        
        // グラデーション背景
        const gradient = ctx.createLinearGradient(0, 0, 200, 200);
        gradient.addColorStop(0, '#8B4513');
        gradient.addColorStop(1, '#D2691E');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, 200, 200);
        
        // テキストを追加
        ctx.fillStyle = 'white';
        ctx.font = 'bold 20px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('テストワイン', 100, 100);
        ctx.font = '14px Arial';
        ctx.fillText('Test Wine Label', 100, 130);
        
        // Blobに変換
        canvas.toBlob((blob) => {
            this.wineImage = blob;
            console.log('テスト用画像を作成しました');
        }, 'image/jpeg', 0.8);
    }

    // ローカルストレージから読み込み
    loadSavedNotes() {
        try {
            const saved = localStorage.getItem('flavorVerse_notes');
            if (saved) {
                this.savedNotes = JSON.parse(saved);
                
                // Blob形式の画像がある場合はBase64に変換
                let needsUpdate = false;
                this.savedNotes.forEach(note => {
                    if (note.image && typeof note.image === 'object' && note.image.type) {
                        console.log('Blob形式の画像を検出、Base64に変換中...');
                        // Blob形式の画像をBase64に変換
                        const reader = new FileReader();
                        reader.onload = (e) => {
                            note.image = e.target.result;
                            console.log('画像をBase64に変換完了');
                            // 変換後にローカルストレージを更新
                            this.saveToLocalStorage();
                        };
                        reader.readAsDataURL(note.image);
                        needsUpdate = true;
                    }
                });
                
                if (needsUpdate) {
                    console.log('Blob形式の画像をBase64に変換して保存し直します');
                }
            }
        } catch (error) {
            console.error('ローカルストレージ読み込みエラー:', error);
            this.savedNotes = [];
        }
    }

    // ページ表示切り替え
    showPage(pageName) {
        // すべてのページを非表示
        document.querySelectorAll('.step-section, .page-section').forEach(section => {
            section.style.display = 'none';
        });

        // ナビゲーションメニューを閉じる
        this.closeNavMenu();

        if (pageName === 'home') {
            // ホームページ（メインのステップ）
            this.showStep(1);
        } else if (pageName === 'list') {
            // 一覧ページ
            const listPage = document.getElementById('list-page');
            listPage.style.display = 'block';
            listPage.classList.add('visible');
            this.displayNotesList();
        } else if (pageName === 'settings') {
            // 設定ページ
            const settingsPage = document.getElementById('settings-page');
            settingsPage.style.display = 'block';
            settingsPage.classList.add('visible');
            this.loadSettingsPage();
        }
    }

    // ナビゲーションメニューの切り替え
    toggleNavMenu() {
        const navMenu = document.getElementById('navMenu');
        const hamburgerMenu = document.getElementById('hamburgerMenu');
        
        if (!navMenu || !hamburgerMenu) {
            console.error('ナビゲーションメニューまたはハンバーガーメニュー要素が見つかりません');
            return;
        }
        
        // メニューの表示切り替え
        if (navMenu.classList.contains('show')) {
            // メニューを閉じる
            navMenu.classList.remove('show');
            hamburgerMenu.classList.remove('active');
        } else {
            // メニューを開く
            navMenu.classList.add('show');
            hamburgerMenu.classList.add('active');
        }
        
    }

    // ナビゲーションメニューを閉じる
    closeNavMenu() {
        const navMenu = document.getElementById('navMenu');
        const hamburgerMenu = document.getElementById('hamburgerMenu');
        if (navMenu && hamburgerMenu) {
            navMenu.classList.remove('show');
            hamburgerMenu.classList.remove('active');
        }
    }

    // ナビゲーションアイテムのアニメーション
    animateNavItem(navItem) {
        navItem.style.transform = 'translateX(8px) scale(0.95)';
        navItem.style.background = 'linear-gradient(135deg, rgba(139, 69, 19, 0.2), rgba(210, 180, 140, 0.2))';
        
        setTimeout(() => {
            navItem.style.transform = '';
            navItem.style.background = '';
        }, 200);
    }

    // 一覧表示
    displayNotesList() {
        const notesList = document.getElementById('notesList');
        if (this.savedNotes.length === 0) {
            notesList.innerHTML = '<p class="no-notes">保存されたテイスティングノートがありません。</p>';
            return;
        }

        const notesHtml = this.savedNotes.map(note => {
            console.log('ノート表示:', note.id, '画像:', note.image ? 'あり' : 'なし');
            if (note.image) {
                console.log('画像データの型:', typeof note.image);
                if (typeof note.image === 'string') {
                    console.log('画像データの長さ:', note.image.length);
                    console.log('画像データの先頭:', note.image.substring(0, 50));
                } else {
                    console.log('画像データ（非文字列）:', note.image);
                }
            }
            
            // 画像データの処理
            let imageHtml = '<div class="note-card-image no-image">📷 画像なし</div>';
            if (note.image) {
                if (typeof note.image === 'string') {
                    // Base64形式の画像
                    imageHtml = `<img src="${note.image}" alt="Wine Label" class="note-card-image" onerror="console.error('画像読み込みエラー:', this.src.substring(0, 50))">`;
                } else if (note.image instanceof Blob) {
                    // Blob形式の画像をBase64に変換
                    const reader = new FileReader();
                    reader.onload = function(e) {
                        const img = document.querySelector(`[data-id="${note.id}"] .note-card-image`);
                        if (img) {
                            img.src = e.target.result;
                        }
                    };
                    reader.readAsDataURL(note.image);
                    imageHtml = `<img src="" alt="Wine Label" class="note-card-image" data-id="${note.id}">`;
                } else {
                    console.warn('未知の画像形式:', note.image);
                }
            }
            
            return `
            <div class="note-card" data-id="${note.id}">
                ${imageHtml}
                <div class="note-card-content">
                    <div class="note-card-text">${note.content}</div>
                </div>
                <div class="note-card-meta">
                    <span class="note-tag">${note.tag}</span>
                    <span class="note-date">${this.formatDate(note.createdAt)}</span>
                </div>
            </div>
        `;
        }).join('');

        notesList.innerHTML = notesHtml;

        // カードクリックイベント
        notesList.querySelectorAll('.note-card').forEach(card => {
            card.addEventListener('click', () => {
                const noteId = card.getAttribute('data-id');
                this.viewNote(noteId);
            });
        });
    }

    // ノートタイトル生成

    // 日付フォーマット
    formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('ja-JP', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    }

    // フレーバーを日本語に変換
    convertFlavorsToJapanese(flavors) {
        if (!flavors || !Array.isArray(flavors)) {
            return [];
        }
        
        return flavors.map(flavor => {
            // カスタムフレーバー（日本語で入力されたもの）はそのまま返す
            if (this.flavorMap[flavor]) {
                return this.flavorMap[flavor];
            }
            // マップにない場合はそのまま返す（カスタムフレーバー）
            return flavor;
        });
    }

    // 結果アクションボタンを非表示
    hideResultActions() {
        const resultActions = document.querySelector('.result-actions');
        if (resultActions) {
            resultActions.style.display = 'none';
        }
    }

    // 結果アクションボタンを表示
    showResultActions() {
        const resultActions = document.querySelector('.result-actions');
        if (resultActions) {
            resultActions.style.display = 'flex';
        }
    }

    // 保存ボタンを無効化
    disableSaveButton() {
        const saveButton = document.getElementById('save-note');
        if (saveButton) {
            saveButton.disabled = true;
            saveButton.style.opacity = '0.5';
            saveButton.style.cursor = 'not-allowed';
            saveButton.textContent = '⏳ 生成中...';
        }
    }

    // 保存ボタンを有効化
    enableSaveButton() {
        const saveButton = document.getElementById('save-note');
        if (saveButton) {
            saveButton.disabled = false;
            saveButton.style.opacity = '1';
            saveButton.style.cursor = 'pointer';
            saveButton.textContent = '保存';
        }
    }

    // 保存されていないノートがあるかチェック
    hasUnsavedNote() {
        // ステップ4（結果セクション）が表示されているかチェック
        const resultsSection = document.getElementById('results-section');
        if (!resultsSection || resultsSection.style.display === 'none') {
            return false;
        }
        
        // プログレスバーが表示されている場合は生成中なので未保存ではない
        const progressContainer = document.getElementById('progress-container');
        if (progressContainer && progressContainer.style.display !== 'none') {
            return false;
        }
        
        // テイスティングノートのコンテンツがあるかチェック
        const tastingNoteElement = document.getElementById('tasting-note');
        if (!tastingNoteElement) {
            return false;
        }
        
        const textContent = tastingNoteElement.textContent.trim();
        
        // テキストコンテンツが十分にあるかチェック（プログレスバー以外のコンテンツ）
        if (textContent.length > 50) { // 十分な長さのテキストがある
            return true;
        }
        
        return false;
    }

    // ノート詳細表示
    viewNote(noteId) {
        const note = this.savedNotes.find(n => n.id === noteId);
        if (!note) return;

        this.showNoteDialog(note);
    }

    // ノート詳細ダイアログ表示
    showNoteDialog(note) {
        const modal = document.createElement('div');
        modal.className = 'modal-overlay';
        modal.style.display = 'flex';
        modal.style.position = 'fixed';
        modal.style.top = '0';
        modal.style.left = '0';
        modal.style.width = '100%';
        modal.style.height = '100%';
        modal.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
        modal.style.justifyContent = 'center';
        modal.style.alignItems = 'center';
        modal.style.zIndex = '9999';
        
        modal.innerHTML = `
            <div class="modal-content" style="background: white; padding: 2rem; border-radius: 15px; max-width: 600px; width: 90%; max-height: 80vh; overflow-y: auto;">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem;">
                    <h3 style="margin: 0; color: #8B4513;">📝 テイスティングノート詳細</h3>
                    <button id="closeNoteDialog" style="background: none; border: none; font-size: 1.5rem; cursor: pointer; color: #666;">&times;</button>
                </div>
                
                <div style="margin-bottom: 1rem;">
                    <div style="display: flex; gap: 0.5rem; margin-bottom: 1rem;">
                        <span class="note-tag" style="background: #8B4513; color: white; padding: 0.3rem 0.8rem; border-radius: 15px; font-size: 0.9rem;">${note.tag}</span>
                        <span style="color: #666; font-size: 0.9rem;">${this.formatDate(note.createdAt)}</span>
                    </div>
                    
                    ${note.image ? `
                        <div style="text-align: center; margin-bottom: 1rem;">
                            <img src="${note.image}" alt="Wine Label" style="max-width: 200px; max-height: 200px; border-radius: 10px; box-shadow: 0 4px 8px rgba(0,0,0,0.1);">
                        </div>
                    ` : ''}
                    
                    <div style="background: #f8f9fa; padding: 1rem; border-radius: 10px; margin-bottom: 1rem;">
                        <h4 style="margin: 0 0 0.5rem 0; color: #8B4513;">テイスティングノート</h4>
                        <div id="noteContent" style="white-space: pre-wrap; line-height: 1.6; color: #333;">${note.content}</div>
                    </div>
                    
                    <div style="background: #f8f9fa; padding: 1rem; border-radius: 10px; margin-bottom: 1rem;">
                        <h4 style="margin: 0 0 0.5rem 0; color: #8B4513;">フレーバー</h4>
                        <div style="display: flex; flex-wrap: wrap; gap: 0.3rem;">
                            ${note.flavors ? this.convertFlavorsToJapanese(note.flavors).map(flavor => 
                                `<span style="background: #e9ecef; padding: 0.2rem 0.5rem; border-radius: 10px; font-size: 0.9rem;">${flavor}</span>`
                            ).join('') : 'なし'}
                        </div>
                    </div>
                    
                </div>
                
                <div class="modal-actions">
                    <button id="editNote" class="btn btn-primary modal-btn">✏️ 編集</button>
                    <button id="deleteNote" class="btn btn-danger modal-btn">🗑️ 削除</button>
                    <button id="closeDialog" class="btn btn-outline modal-btn">閉じる</button>
                </div>
            </div>
        `;

        document.body.appendChild(modal);

        // イベントリスナー
        modal.querySelector('#closeNoteDialog').addEventListener('click', () => {
            document.body.removeChild(modal);
        });

        modal.querySelector('#closeDialog').addEventListener('click', () => {
            document.body.removeChild(modal);
        });

        modal.querySelector('#editNote').addEventListener('click', () => {
            document.body.removeChild(modal);
            this.editNote(note);
        });

        modal.querySelector('#deleteNote').addEventListener('click', () => {
            document.body.removeChild(modal);
            this.deleteNote(note);
        });

        // モーダル外クリックで閉じる
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                document.body.removeChild(modal);
            }
        });
    }

    // ノート編集
    editNote(note) {
        const modal = document.createElement('div');
        modal.className = 'modal-overlay';
        modal.style.display = 'flex';
        modal.style.position = 'fixed';
        modal.style.top = '0';
        modal.style.left = '0';
        modal.style.width = '100%';
        modal.style.height = '100%';
        modal.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
        modal.style.justifyContent = 'center';
        modal.style.alignItems = 'center';
        modal.style.zIndex = '9999';
        
        modal.innerHTML = `
            <div class="modal-content" style="background: white; padding: 2rem; border-radius: 15px; max-width: 600px; width: 90%; max-height: 80vh; overflow-y: auto;">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem;">
                    <h3 style="margin: 0; color: #8B4513;">✏️ ノート編集</h3>
                    <button id="closeEditDialog" style="background: none; border: none; font-size: 1.5rem; cursor: pointer; color: #666;">&times;</button>
                </div>
                
                <div style="margin-bottom: 1rem;">
                    <label style="display: block; margin-bottom: 0.5rem; font-weight: bold; color: #8B4513;">タグ</label>
                    <select id="editTag" style="width: 100%; padding: 0.5rem; border: 1px solid #ddd; border-radius: 5px; margin-bottom: 1rem;">
                        <option value="ワイン" ${note.tag === 'ワイン' ? 'selected' : ''}>🍷 ワイン</option>
                        <option value="ウイスキー" ${note.tag === 'ウイスキー' ? 'selected' : ''}>🥃 ウイスキー</option>
                    </select>
                    
                    <label style="display: block; margin-bottom: 0.5rem; font-weight: bold; color: #8B4513;">テイスティングノート</label>
                    <textarea id="editContent" style="width: 100%; height: 200px; padding: 0.8rem; border: 1px solid #ddd; border-radius: 5px; font-family: inherit; resize: vertical; margin-bottom: 1rem;">${note.content}</textarea>
                    
                    <label style="display: block; margin-bottom: 0.5rem; font-weight: bold; color: #8B4513;">画像</label>
                    <div style="margin-bottom: 1rem;">
                        ${note.image ? `
                            <div style="text-align: center; margin-bottom: 1rem;">
                                <img src="${note.image}" alt="Current Image" style="max-width: 200px; max-height: 200px; border-radius: 10px; box-shadow: 0 4px 8px rgba(0,0,0,0.1);">
                            </div>
                        ` : '<div style="text-align: center; color: #666; margin-bottom: 1rem;">画像なし</div>'}
                        
                        <div style="text-align: center;">
                            <input type="file" id="editImageInput" accept="image/*" style="display: none;">
                            <button type="button" id="changeImageBtn" style="padding: 0.5rem 1rem; border: 1px solid #8B4513; background: #8B4513; color: white; border-radius: 5px; cursor: pointer; margin-right: 0.5rem;">📷 画像を変更</button>
                            ${note.image ? `<button type="button" id="removeImageBtn" style="padding: 0.5rem 1rem; border: 1px solid #dc3545; background: #dc3545; color: white; border-radius: 5px; cursor: pointer;">🗑️ 画像を削除</button>` : ''}
                        </div>
                    </div>
                </div>
                
                <div class="modal-actions">
                    <button id="saveEdit" class="btn btn-primary modal-btn">💾 保存</button>
                    <button id="cancelEdit" class="btn btn-outline modal-btn">キャンセル</button>
                </div>
            </div>
        `;

        document.body.appendChild(modal);

        // 画像変更機能
        const changeImageBtn = modal.querySelector('#changeImageBtn');
        const editImageInput = modal.querySelector('#editImageInput');
        const removeImageBtn = modal.querySelector('#removeImageBtn');
        let newImage = null;

        changeImageBtn.addEventListener('click', () => {
            editImageInput.click();
        });

        editImageInput.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (file) {
                // 画像をプレビュー表示
                const reader = new FileReader();
                reader.onload = (e) => {
                    const previewImg = modal.querySelector('img');
                    if (previewImg) {
                        previewImg.src = e.target.result;
                    } else {
                        // 画像がない場合は新しく表示
                        const imageContainer = modal.querySelector('div[style*="text-align: center"]');
                        imageContainer.innerHTML = `
                            <div style="text-align: center; margin-bottom: 1rem;">
                                <img src="${e.target.result}" alt="New Image" style="max-width: 200px; max-height: 200px; border-radius: 10px; box-shadow: 0 4px 8px rgba(0,0,0,0.1);">
                            </div>
                        `;
                    }
                };
                reader.readAsDataURL(file);
                newImage = file;
            }
        });

        if (removeImageBtn) {
            removeImageBtn.addEventListener('click', () => {
                const imageContainer = modal.querySelector('div[style*="text-align: center"]');
                imageContainer.innerHTML = '<div style="text-align: center; color: #666; margin-bottom: 1rem;">画像なし</div>';
                newImage = 'remove'; // 削除フラグ
            });
        }

        // イベントリスナー
        modal.querySelector('#closeEditDialog').addEventListener('click', () => {
            document.body.removeChild(modal);
        });

        modal.querySelector('#cancelEdit').addEventListener('click', () => {
            document.body.removeChild(modal);
        });

        modal.querySelector('#saveEdit').addEventListener('click', async () => {
            try {
                // 画像処理
                let updatedImage = note.image;
                if (newImage === 'remove') {
                    updatedImage = null;
                } else if (newImage) {
                    // 新しい画像を圧縮
                    updatedImage = await this.compressImage(newImage);
                }

                // 編集内容を保存
                const editedNote = {
                    ...note,
                    tag: modal.querySelector('#editTag').value,
                    content: modal.querySelector('#editContent').value,
                    image: updatedImage
                };

                // ノートを更新
                const noteIndex = this.savedNotes.findIndex(n => n.id === note.id);
                if (noteIndex !== -1) {
                    this.savedNotes[noteIndex] = editedNote;
                    this.saveToLocalStorage();
                    this.displayNotesList(); // 一覧を更新
                }

                document.body.removeChild(modal);
                alert('ノートを更新しました！');
            } catch (error) {
                console.error('ノート更新エラー:', error);
                alert('ノートの更新中にエラーが発生しました。');
            }
        });

        // モーダル外クリックで閉じる
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                document.body.removeChild(modal);
            }
        });
    }

    // ノート削除
    deleteNote(note) {
        const confirmed = confirm(`このノートを削除しますか？\n\nこの操作は取り消せません。`);
        if (confirmed) {
            const noteIndex = this.savedNotes.findIndex(n => n.id === note.id);
            if (noteIndex !== -1) {
                this.savedNotes.splice(noteIndex, 1);
                this.saveToLocalStorage();
                this.displayNotesList(); // 一覧を更新
                alert('ノートを削除しました。');
            }
        }
    }

    // フィルタリング
    filterNotes() {
        const searchTerm = document.getElementById('searchInput').value.toLowerCase();
        const tagFilter = document.getElementById('tagFilter').value;
        const sortBy = document.getElementById('sortBy').value;

        let filteredNotes = [...this.savedNotes];

        // 検索フィルタ
        if (searchTerm) {
            filteredNotes = filteredNotes.filter(note => 
                note.content.toLowerCase().includes(searchTerm) ||
                note.tag.toLowerCase().includes(searchTerm)
            );
        }

        // タグフィルタ
        if (tagFilter) {
            filteredNotes = filteredNotes.filter(note => note.tag === tagFilter);
        }

        // ソート
        filteredNotes.sort((a, b) => {
            switch (sortBy) {
                case 'date-desc':
                    return new Date(b.createdAt) - new Date(a.createdAt);
                case 'date-asc':
                    return new Date(a.createdAt) - new Date(b.createdAt);
                case 'tag':
                    return a.tag.localeCompare(b.tag);
                default:
                    return 0;
            }
        });

        // 表示更新
        this.displayFilteredNotes(filteredNotes);
    }

    // フィルタされたノート表示
    displayFilteredNotes(notes) {
        const notesList = document.getElementById('notesList');
        if (notes.length === 0) {
            notesList.innerHTML = '<p class="no-notes">該当するノートが見つかりません。</p>';
            return;
        }

        const notesHtml = notes.map(note => `
            <div class="note-card" data-id="${note.id}">
                ${note.image ? `<img src="${note.image}" alt="Wine Label" class="note-card-image">` : '<div class="note-card-image no-image">📷 画像なし</div>'}
                <div class="note-card-content">
                    <div class="note-card-text">${note.content}</div>
                </div>
                <div class="note-card-meta">
                    <span class="note-tag">${note.tag}</span>
                    <span class="note-date">${this.formatDate(note.createdAt)}</span>
                </div>
            </div>
        `).join('');

        notesList.innerHTML = notesHtml;

        // カードクリックイベント
        notesList.querySelectorAll('.note-card').forEach(card => {
            card.addEventListener('click', () => {
                const noteId = card.getAttribute('data-id');
                this.viewNote(noteId);
            });
        });
    }

    // 設定ページ読み込み
    loadSettingsPage() {
        // 既存の設定を読み込み
        const settings = this.loadSettings();
        
        // 設定値を反映
        const enableGemini = document.getElementById('enableGemini');
        const enableGroq = document.getElementById('enableGroq');
        const defaultPoetryLevel = document.getElementById('defaultPoetryLevel');
        const poetryLevelValue = document.getElementById('poetryLevelValue');
        const defaultTag = document.getElementById('defaultTag');

        if (enableGemini) enableGemini.checked = settings.enableGemini !== false;
        if (enableGroq) enableGroq.checked = settings.enableGroq !== false;
        if (defaultPoetryLevel) {
            defaultPoetryLevel.value = settings.defaultPoetryLevel || 3;
            if (poetryLevelValue) poetryLevelValue.textContent = defaultPoetryLevel.value;
        }
        if (defaultTag) defaultTag.value = settings.defaultTag || 'ワイン';

        // スライダーイベント
        if (defaultPoetryLevel && poetryLevelValue) {
            defaultPoetryLevel.addEventListener('input', (e) => {
                poetryLevelValue.textContent = e.target.value;
            });
        }

        // 設定変更時の自動保存
        if (enableGemini) {
            enableGemini.addEventListener('change', () => this.saveSettingsToStorage());
        }
        if (enableGroq) {
            enableGroq.addEventListener('change', () => this.saveSettingsToStorage());
        }
        if (defaultPoetryLevel) {
            defaultPoetryLevel.addEventListener('change', () => this.saveSettingsToStorage());
        }
        if (defaultTag) {
            defaultTag.addEventListener('change', () => this.saveSettingsToStorage());
        }
    }

    // 設定をローカルストレージに保存
    saveSettingsToStorage() {
        const settings = {
            enableGemini: document.getElementById('enableGemini')?.checked !== false,
            enableGroq: document.getElementById('enableGroq')?.checked !== false,
            defaultPoetryLevel: parseInt(document.getElementById('defaultPoetryLevel')?.value || 3),
            defaultTag: document.getElementById('defaultTag')?.value || 'ワイン'
        };
        
        localStorage.setItem('flavorVerse_settings', JSON.stringify(settings));
    }

    // データエクスポート
    exportData() {
        const data = {
            notes: this.savedNotes,
            settings: this.loadSettings(),
            exportDate: new Date().toISOString()
        };

        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `flavorVerse_backup_${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    // データインポート
    importData(event) {
        const file = event.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const data = JSON.parse(e.target.result);
                
                if (data.notes) {
                    this.savedNotes = data.notes;
                    this.saveToLocalStorage();
                }
                
                if (data.settings) {
                    localStorage.setItem('flavorVerse_settings', JSON.stringify(data.settings));
                }
                
                alert('データをインポートしました！');
                this.loadSettingsPage();
            } catch (error) {
                console.error('インポートエラー:', error);
                alert('ファイルの読み込みに失敗しました。');
            }
        };
        reader.readAsText(file);
    }

    // 全データ削除
    clearAllData() {
        if (confirm('すべてのデータを削除しますか？この操作は取り消せません。')) {
            this.savedNotes = [];
            localStorage.removeItem('flavorVerse_notes');
            localStorage.removeItem('flavorVerse_settings');
            alert('すべてのデータを削除しました。');
            this.displayNotesList();
        }
    }

    // モバイルタブ切り替え
    switchTab(event) {
        const tabName = event.target.getAttribute('data-tab');
        
        // すべてのタブボタンからactiveクラスを削除
        document.querySelectorAll('.tab-button').forEach(btn => {
            btn.classList.remove('active');
        });
        
        // すべてのタブパネルからactiveクラスを削除
        document.querySelectorAll('.tab-panel').forEach(panel => {
            panel.classList.remove('active');
        });
        
        // クリックされたタブボタンにactiveクラスを追加
        event.target.classList.add('active');
        
        // 対応するタブパネルにactiveクラスを追加
        const targetPanel = document.getElementById(`tab-${tabName}`);
        if (targetPanel) {
            targetPanel.classList.add('active');
        }
    }
    
    // モバイル用カスタムフレーバー追加
    addCustomFlavorMobile() {
        const input = document.getElementById('custom-flavor-mobile');
        if (!input) return;
        
        const flavor = input.value.trim();
        if (!flavor) return;
        
        // 重複チェック
        if (this.customFlavors.includes(flavor)) {
            alert('このフレーバーは既に追加されています。');
            return;
        }
        
        this.customFlavors.push(flavor);
        this.updateCustomFlavorsList();
        this.updateFlavorSelectionState();
        input.value = '';
    }
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new FlavorVerse();
});
