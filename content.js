/**
 * Hacker News Subtext Toggle Extension
 * 控制.subtext元素显示/隐藏的功能脚本
 */

// 注入字体到页面
function injectFonts() {
  if (!document.head) {
    // 等待 head 元素创建
    const observer = new MutationObserver(() => {
      if (document.head) {
        observer.disconnect();
        addFontFace();
      }
    });
    observer.observe(document.documentElement, { childList: true });
    return;
  }
  addFontFace();
}

function addFontFace() {
  const fontFaces = `
    @font-face {
      font-family: 'Amarna';
      font-style: normal;
      font-weight: 100 900;
      font-display: swap;
      src: url('${chrome.runtime.getURL("fonts/Amarna-VariableFont_wght.ttf")}') format('truetype');
    }
    @font-face {
      font-family: 'Cause';
      font-style: normal;
      font-weight: 100 900;
      font-display: swap;
      src: url('${chrome.runtime.getURL("fonts/Cause-VariableFont_wght.ttf")}') format('truetype');
    }
    @font-face {
      font-family: 'GoogleSansFlex';
      font-style: normal;
      font-weight: 1 1000;
      font-display: swap;
      src: url('${chrome.runtime.getURL("fonts/GoogleSansFlex-VariableFont_GRAD,ROND,opsz,slnt,wdth,wght.ttf")}') format('truetype');
    }
    @font-face {
      font-family: 'LXGWZhenKaiGB-Regular';
      font-style: normal;
      font-weight: 400 600;
      font-display: swap;
      src: url('${chrome.runtime.getURL("fonts/LXGWZhenKaiGB-Regular.ttf")}') format('truetype');
    }
    @font-face {
      font-family: 'MapleMono';
      font-style: normal;
      font-weight: 100 900;
      font-display: swap;
      src: url('${chrome.runtime.getURL("fonts/MapleMono[wght].ttf")}') format('truetype');
    }
    @font-face {
      font-family: 'Outfit';
      font-style: normal;
      font-weight: 100 900;
      font-display: swap;
      src: url('${chrome.runtime.getURL("fonts/Outfit-VariableFont_wght.ttf")}') format('truetype');
    }
    @font-face {
      font-family: 'Oxygen';
      font-style: normal;
      font-weight: 400;
      font-display: swap;
      src: url('${chrome.runtime.getURL("fonts/Oxygen-Regular.ttf")}') format('truetype');
    }
    @font-face {
      font-family: 'PlayfairDisplay';
      font-style: normal;
      font-weight: 400 900;
      font-display: swap;
      src: url('${chrome.runtime.getURL("fonts/PlayfairDisplay-VariableFont_wght.ttf")}') format('truetype');
    }
  `;

  const style = document.createElement('style');
  style.textContent = fontFaces;
  document.head.appendChild(style);
}

// 在页面加载前注入字体
injectFonts();

class SubtextToggle {
  constructor() {
    this.storageKey = 'hnSubtextIsHidden';
    this.fontStorageKey = 'hnReaderFont';
    this.fonts = [
      {
        id: 'lxgw-zhengkai',
        label: '霞鹜',
        family: "'LXGWZhenKaiGB-Regular', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
        monoFamily: "'MapleMono', 'SF Mono', 'Fira Code', monospace"
      },
      {
        id: 'maple-mono',
        label: 'Maple',
        family: "'MapleMono', 'LXGWZhenKaiGB-Regular', system-ui, sans-serif",
        monoFamily: "'MapleMono', 'SF Mono', monospace"
      },
      {
        id: 'google-sans-flex',
        label: 'Google',
        family: "'GoogleSansFlex', 'LXGWZhenKaiGB-Regular', system-ui, sans-serif",
        monoFamily: "'MapleMono', 'SF Mono', monospace"
      },
      {
        id: 'outfit',
        label: 'Outfit',
        family: "'Outfit', 'LXGWZhenKaiGB-Regular', system-ui, sans-serif",
        monoFamily: "'MapleMono', 'SF Mono', monospace"
      },
      {
        id: 'oxygen',
        label: 'Oxygen',
        family: "'Oxygen', 'LXGWZhenKaiGB-Regular', system-ui, sans-serif",
        monoFamily: "'MapleMono', 'SF Mono', monospace"
      },
      {
        id: 'cause',
        label: 'Cause',
        family: "'Cause', 'LXGWZhenKaiGB-Regular', system-ui, sans-serif",
        monoFamily: "'MapleMono', 'SF Mono', monospace"
      },
      {
        id: 'playfair-display',
        label: 'Playfair',
        family: "'PlayfairDisplay', 'LXGWZhenKaiGB-Regular', Georgia, serif",
        monoFamily: "'MapleMono', 'SF Mono', monospace"
      },
      {
        id: 'amarna',
        label: 'Amarna',
        family: "'Amarna', 'LXGWZhenKaiGB-Regular', Georgia, serif",
        monoFamily: "'MapleMono', 'SF Mono', monospace"
      }
    ];
    this.isHidden = true; // 默认隐藏状态
    this.currentFontIndex = 0;
    this.panel = null;
    this.button = null;
    this.fontButton = null;
    this.init();
  }

  init() {
    // 等待DOM加载完成
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => this.setup());
    } else {
      this.setup();
    }
  }

  async setup() {
    await this.loadState();

    this.applyFont();

    // 初始隐藏所有.subtext元素
    this.toggleSubtextVisibility(this.isHidden);
    
    // 创建控制面板
    this.createControlPanel();
    
    // 监听可能的动态内容加载
    this.observeDOMChanges();
  }

  /**
   * 读取持久化的显示状态
   */
  async loadState() {
    try {
      const result = await chrome.storage.local.get(this.storageKey);
      if (typeof result[this.storageKey] === 'boolean') {
        this.isHidden = result[this.storageKey];
      }
      const fontResult = await chrome.storage.local.get(this.fontStorageKey);
      this.setFontIndex(fontResult[this.fontStorageKey]);
    } catch (error) {
      const savedState = window.localStorage.getItem(this.storageKey);
      if (savedState !== null) {
        this.isHidden = savedState === 'true';
      }
      this.setFontIndex(window.localStorage.getItem(this.fontStorageKey));
    }
  }

  /**
   * 保存当前显示状态
   */
  async saveState() {
    try {
      await chrome.storage.local.set({ [this.storageKey]: this.isHidden });
    } catch (error) {
      window.localStorage.setItem(this.storageKey, String(this.isHidden));
    }
  }

  /**
   * 保存当前字体
   */
  async saveFontState() {
    const currentFont = this.fonts[this.currentFontIndex];

    try {
      await chrome.storage.local.set({ [this.fontStorageKey]: currentFont.id });
    } catch (error) {
      window.localStorage.setItem(this.fontStorageKey, currentFont.id);
    }
  }

  /**
   * 创建浮动控制面板
   */
  createControlPanel() {
    // 创建面板容器
    this.panel = document.createElement('div');
    this.panel.id = 'hn-subtext-toggle-panel';
    
    // 创建切换按钮
    this.button = document.createElement('button');
    this.button.id = 'hn-subtext-toggle-button';
    this.button.textContent = this.isHidden ? '显示信息' : '隐藏信息';
    this.button.title = '点击切换信息显示状态';

    // 创建字体切换按钮
    this.fontButton = document.createElement('button');
    this.fontButton.id = 'hn-font-toggle-button';
    this.fontButton.title = '点击切换页面字体';
    this.updateFontButtonText();
    
    // 添加事件监听
    this.button.addEventListener('click', () => this.toggleState());
    this.fontButton.addEventListener('click', () => this.toggleFont());
    
    // 组装面板
    this.panel.appendChild(this.button);
    this.panel.appendChild(this.fontButton);
    document.body.appendChild(this.panel);
  }

  /**
   * 根据保存值设置字体索引
   * @param {string} fontId - 字体标识
   */
  setFontIndex(fontId) {
    const savedIndex = this.fonts.findIndex((font) => font.id === fontId);
    this.currentFontIndex = savedIndex >= 0 ? savedIndex : 0;
  }

  /**
   * 应用当前字体到页面
   */
  applyFont() {
    const currentFont = this.fonts[this.currentFontIndex];

    document.documentElement.style.setProperty('--hn-reader-font', currentFont.family);
    document.documentElement.style.setProperty('--hn-mono-font', currentFont.monoFamily);
  }

  /**
   * 切换页面字体
   */
  toggleFont() {
    this.currentFontIndex = (this.currentFontIndex + 1) % this.fonts.length;
    this.applyFont();
    this.updateFontButtonText();
    this.saveFontState();
  }

  /**
   * 切换.subtext元素的显示状态
   * @param {boolean} hide - 是否隐藏
   */
  toggleSubtextVisibility(hide) {
    const subtextElements = document.querySelectorAll('.subtext');
    
    subtextElements.forEach(element => {
      if (hide) {
        element.style.display = 'none';
        element.setAttribute('data-hidden', 'true');
      } else {
        element.style.display = '';
        element.removeAttribute('data-hidden');
      }
    });
  }

  /**
   * 切换显示状态
   */
  toggleState() {
    this.isHidden = !this.isHidden;
    this.toggleSubtextVisibility(this.isHidden);
    this.updateButtonText();
    this.saveState();
  }

  /**
   * 更新按钮文本
   */
  updateButtonText() {
    this.button.textContent = this.isHidden ? '显示信息' : '隐藏信息';
  }

  /**
   * 更新字体按钮文本
   */
  updateFontButtonText() {
    const currentFont = this.fonts[this.currentFontIndex];
    this.fontButton.textContent = `字体：${currentFont.label}`;
  }

  /**
   * 监听DOM变化，处理动态加载的内容
   */
  observeDOMChanges() {
    const observer = new MutationObserver((mutations) => {
      let shouldUpdate = false;
      
      mutations.forEach((mutation) => {
        // 检查是否有新的.subtext元素被添加
        mutation.addedNodes.forEach((node) => {
          if (node.nodeType === Node.ELEMENT_NODE) {
            if (node.classList && node.classList.contains('subtext')) {
              shouldUpdate = true;
            }
            // 检查子元素中是否包含.subtext
            const subtexts = node.querySelectorAll && node.querySelectorAll('.subtext');
            if (subtexts && subtexts.length > 0) {
              shouldUpdate = true;
            }
          }
        });
      });
      
      if (shouldUpdate) {
        // 延迟执行以确保DOM完全更新
        setTimeout(() => {
          this.toggleSubtextVisibility(this.isHidden);
        }, 100);
      }
    });

    // 开始观察body的变化
    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
  }

  /**
   * 清理资源
   */
  destroy() {
    if (this.panel) {
      this.panel.remove();
    }
  }
}

// 初始化扩展功能
const subtextToggle = new SubtextToggle();

// 页面卸载时清理
window.addEventListener('beforeunload', () => {
  subtextToggle.destroy();
});
