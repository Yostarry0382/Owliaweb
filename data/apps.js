/* Owlia App Data — edit via admin or update this file directly */
window.__OWLIA_APPS = [
  {
    id: 'sprite',
    name: 'Owlia-Sprite',
    role: '常駐型AIエージェント',
    description: 'デスクトップ常駐AIエージェント。ショートカットキーでサクッとAIにタスクを依頼。',
    categories: ['available', 'general'],
    badge: 'available',
    badgeLabel: '\u2705 利用可能',
    icon: 'docs/character/transparent/sprite.webp',
    tags: ['ショートカットキー起動', '音声入力', 'キャプチャ', 'タスク登録'],
    ctaLabel: 'ダウンロード',
    ctaLink: 'go.html?app=sprite&url=https://owlia-sprite.dairab.local',
    detail: {
      emoji: '\uD83D\uDCBB',
      eyecatch: 'docs/apppr/Sprite.webp',
      fullRole: 'あなたのパートナー - デスクトップ常駐ランチャー',
      fullDescription: 'Spriteはデスクトップに常駐するAIエージェント。ショートカットキーで起動し、手軽にサクッとAIにタスクを依頼。一度インストールすればPC起動時に自動常駐。',
      features: [
        'ショートカットキーでどこからでもAIを即起動',
        'テキスト選択でタスクを依頼',
        'スクリーンキャプチャからタスクを依頼',
        'ファイルアップロードからタスクを依頼',
        'AIに画像生成やパソコン操作を依頼',
        '音声入力で手を止めずに質問'
      ],
      hint: null,
      detailCtaLabel: 'Spriteをダウンロード'
    }
  },
  {
    id: 'portal',
    name: 'Owlia-Portal',
    role: '知恵の書庫',
    description: 'ドキュメントをRAG設定で登録し、Owliaアプリで有効活用化',
    categories: ['available', 'general'],
    badge: 'available',
    badgeLabel: '\u2705 利用可能',
    icon: 'docs/character/transparent/portal.webp',
    tags: ['AIチャット', 'RAG設定', 'AIコーディング', 'ファイル学習'],
    ctaLabel: 'ログイン',
    ctaLink: 'go.html?app=portal&url=https://owlia.dairab.local/portal',
    detail: {
      emoji: '\uD83C\uDF0D',
      eyecatch: 'docs/apppr/Portal2.webp',
      fullRole: 'Owliaのエントランス',
      fullDescription: 'Portalは中心となるWebアプリ。AIとの対話、社内ドキュメントのRAG設定、登録した文書の知識を即座に他Owliaアプリに共有。',
      features: [
        '社内RAG対応AIチャット',
        '簡易AIコーディング機能',
        'RAG設定で社内情報を登録',
        '登録した知識は他owliaアプリ利用可能'
      ],
      hint: 'ID: 氏名コード / 初回PW: <code>12345678</code>',
      detailCtaLabel: 'Portalにログイン'
    }
  },
  {
    id: 'grimoire',
    name: 'Owlia-Grimoire',
    role: '開発者向けAPI',
    description: 'アプリ開発でOwlia APIが使える。開発環境へのAI組み込みを実現。',
    categories: ['available', 'dev'],
    badge: 'available',
    badgeLabel: '\u2705 利用可能',
    icon: 'docs/character/transparent/cobol.webp',
    tags: ['API提供', 'AI組み込み', '開発連携'],
    ctaLabel: 'ドキュメント',
    ctaLink: 'go.html?app=grimoire&url=owlia.dairab.local/portal/owlia-products/grimoire',
    detail: {
      emoji: '\uD83D\uDCDA',
      eyecatch: 'docs/apppr/Grimoire.webp',
      fullRole: '開発者向けAPIプラットフォーム',
      fullDescription: '自分のアプリにOwliaのAI機能を組み込みたい開発者のためのAPI基盤。Owliaの社内RAG・チャット機能等を自由にインテグレーション。',
      features: [
        'Owlia API 利用可能',
        '開発環境へのAI組み込み',
        'ドキュメント・サンプルコード'
      ],
      hint: null,
      detailCtaLabel: 'Grimoireを使う'
    }
  },
  {
    id: 'cobol',
    name: 'Owlia-COBOL',
    role: 'COBOL開発AI支援',
    description: 'VSCode風モダン画面で日本語指示からCOBOLコーディング。AI校正も。',
    categories: ['coming', 'dev'],
    badge: 'coming',
    badgeLabel: '\u23F3 Coming Soon',
    icon: 'docs/character/transparent/plugins.webp',
    tags: ['モダンUI', '日本語指示', 'AI校正'],
    ctaLabel: '準備中',
    ctaLink: null,
    detail: {
      emoji: '\uD83D\uDDA5\uFE0F',
      eyecatch: 'docs/apppr/COBOL.webp',
      fullRole: 'COBOL開発AI支援エディター',
      fullDescription: 'レガシーなCOBOL開発をモダンなUIとAIで変革。VSCode風画面で日本語指示だけでCOBOLコードを生成・校正。',
      features: [
        'VSCode風モダンエディター',
        '日本語指示でコーディング',
        'AIによるコード校正',
        'COBOL特化の補完・支援'
      ],
      hint: null,
      detailCtaLabel: null
    }
  },
  {
    id: 'chronicle',
    name: 'Owlia-Chronicle',
    role: 'AIタスク管理・議事録',
    description: 'プロジェクト管理・スケジュール管理をAIがサポート。',
    categories: ['coming', 'general'],
    badge: 'coming',
    badgeLabel: '\u23F3 Coming Soon',
    icon: 'docs/character/transparent/grimoire.webp',
    tags: ['プロジェクト管理', '議事録', 'スケジュール'],
    ctaLabel: '準備中',
    ctaLink: null,
    detail: {
      emoji: '\uD83D\uDCC5',
      eyecatch: 'docs/apppr/Chronicle.webp',
      fullRole: 'AIプロジェクト管理ツール',
      fullDescription: 'タスクを自動抽出、課題・変更管理、スケジュール管理もAIがサポート。',
      features: [
        'AIタスク管理',
        '課題・障害管理',
        '議事録自動要約',
        'スケジュール管理連携'
      ],
      hint: null,
      detailCtaLabel: null
    }
  },
  {
    id: 'plugins',
    name: 'Owlia-Plugins',
    role: '開発環境AI統合',
    description: 'VSCode等にOwlia AIを直接組み込み。コーディング中にAI支援。',
    categories: ['coming', 'dev'],
    badge: 'coming',
    badgeLabel: '\u23F3 Coming Soon',
    icon: 'docs/character/transparent/chronicle.webp',
    tags: ['VSCode', 'AI統合', 'シームレス'],
    ctaLabel: '準備中',
    ctaLink: null,
    detail: {
      emoji: '\uD83E\uDDE9',
      eyecatch: 'docs/apppr/Plugin.webp',
      fullRole: '開発環境AI統合',
      fullDescription: 'VSCode等の開発環境にOwliaのAI機能を直接統合。エディターから離れずにAI支援を受けられます。',
      features: [
        'VSCode拡張機能',
        'エディター内AI支援',
        'シームレスな統合体験'
      ],
      hint: null,
      detailCtaLabel: null
    }
  }
];
