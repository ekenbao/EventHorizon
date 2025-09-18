/*
NoPrint.js V1.0
Created by PDFAntiCopy.com
*/
document.addEventListener('DOMContentLoaded', function() {
  if (noCopy) 
  { 
			// 1. 基础事件拦截 - 在捕获阶段监听所有元素
			document.addEventListener('copy', function(e){ e.preventDefault(); return false; }, true);
			document.addEventListener('paste', function(e){ e.preventDefault(); return false; }, true);
			document.addEventListener('contextmenu', function(e){ e.preventDefault(); return false; }, true);
			document.addEventListener('selectstart', function(e){ e.preventDefault(); return false; }, true);
			document.addEventListener('dragstart', function(e){ e.preventDefault(); return false; }, true);
			document.addEventListener('cut', function(e){ e.preventDefault(); return false; }, true);
			document.addEventListener('beforecopy', function(e){ e.preventDefault(); return false; }, true);
			document.addEventListener('beforecut', function(e){ e.preventDefault(); return false; }, true);
			document.addEventListener('beforepaste', function(e){ e.preventDefault(); return false; }, true);

			// 2. 为特定元素添加单独的粘贴拦截
			function disablePasteOnElements() {
				const elements = document.querySelectorAll('input, textarea, [contenteditable="true"]');
				elements.forEach(el => {
					el.addEventListener('paste', function(e){ e.preventDefault(); return false; }, true);
					el.addEventListener('drop', function(e){ e.preventDefault(); return false; }, true);
					// 设置属性阻止粘贴
					el.setAttribute('onpaste', 'return false;');
					el.setAttribute('ondrop', 'return false;');
					// 添加CSS阻止选择
					el.style.userSelect = 'none';
					el.style.webkitUserSelect = 'none';
					el.style.mozUserSelect = 'none';
					el.style.msUserSelect = 'none';
				});
			}
			
			// 3. 增强的键盘事件拦截
			document.addEventListener('keydown', function(e) {
				// 禁用Ctrl+S和Cmd+S保存
				if((e.ctrlKey || e.metaKey) && (e.keyCode === 83 || e.key.toLowerCase() === 's')) {
					e.preventDefault();
					e.stopPropagation();
					e.stopImmediatePropagation();
				}
				// 禁用Ctrl+V和Cmd+V粘贴快捷键
				if((e.ctrlKey || e.metaKey) && (e.keyCode === 86 || e.key.toLowerCase() === 'v')) {
					e.preventDefault();
					e.stopPropagation();
					e.stopImmediatePropagation();
				}
				// 禁用Shift+Insert粘贴
				if(e.shiftKey && e.keyCode === 45) {
					e.preventDefault();
					e.stopPropagation();
					e.stopImmediatePropagation();
				}
			}, true);

			// 4. 使用MutationObserver监控动态添加的元素
			const observer = new MutationObserver(function(mutations) {
				mutations.forEach(function(mutation) {
					if(mutation.addedNodes && mutation.addedNodes.length > 0) {
						// 对新添加的节点应用粘贴禁用
						mutation.addedNodes.forEach(function(node) {
							if(node.nodeType === 1) { // 元素节点
								// 检查是否是可输入元素
								if(node.matches('input, textarea, [contenteditable="true"]')) {
									node.addEventListener('paste', function(e){ e.preventDefault(); return false; }, true);
									node.setAttribute('onpaste', 'return false;');
									node.style.userSelect = 'none';
								}
								// 检查子元素中是否有可输入元素
								const childElements = node.querySelectorAll('input, textarea, [contenteditable="true"]');
								childElements.forEach(el => {
									el.addEventListener('paste', function(e){ e.preventDefault(); return false; }, true);
									el.setAttribute('onpaste', 'return false;');
									el.style.userSelect = 'none';
								});
							}
						});
					}
				});
			});
			
			// 配置并启动观察器
			observer.observe(document.body, {
				childList: true,
				subtree: true
			});
			
			// 5. 初始执行元素禁用
			disablePasteOnElements();
  }

  if (noPrint) 
  {     
     var c=document.createElement("span");
     c.style.display="none";
     c.style.postion="absolute";
     c.style.background="#000";
		var first=document.body.firstChild;
		var wraphtml=document.body.insertBefore(c,first);
    c.setAttribute('width', document.body.scrollWidth);
    c.setAttribute('height', document.body.scrollHeight);
    	c.style.display="block";
    	var cssNode3 = document.createElement('style'); 
		cssNode3.type = 'text/css'; 
		cssNode3.media = 'print'; 
		cssNode3.innerHTML ='body{display:none}';
			document.head.appendChild(cssNode3); 	
  }	         
	
  var cssNode2 = document.createElement('style'); 
  cssNode2.type = 'text/css'; 
  cssNode2.media = 'screen'; 
  cssNode2.innerHTML ='div{-webkit-touch-callout: none;-webkit-user-select: none;-khtml-user-select: none;-moz-user-select: none;-ms-user-select: none;user-select: none;}';
  document.head.appendChild(cssNode2);
  document.body.style.cssText="-webkit-touch-callout: none;-webkit-user-select: none;-khtml-user-select: none;-moz-user-select: none;-ms-user-select: none;user-select: none;";  

  // 用于取消之前的恢复清晰操作的定时器ID
  window.clearTimeoutId = null;
  
  // 增强的内容保护函数 - 瞬间遮盖敏感内容
  function toBlur()
  {
    // 立即取消待处理的恢复清晰操作
    if (window.clearTimeoutId) {
      clearTimeout(window.clearTimeoutId);
      window.clearTimeoutId = null;
    }
    
    if (autoBlur || document._screenshotAttemptDetected) {
      // 1. 移除之前可能存在的保护元素，避免重复
      removeProtectionElements();
      
      // 2. 应用模糊效果到body
      document.body.style.cssText="-webkit-filter: blur(15px);-moz-filter: blur(15px);-ms-filter: blur(15px);-o-filter: blur(15px);filter: blur(15px); transition: filter 0ms;";
      
      // 3. 创建一个完全独立于body的顶层覆盖层容器
      const protectionOverlay = document.createElement('div');
      protectionOverlay.id = 'content-protection-overlay';
      protectionOverlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, 0.4); /* 40%不透明度的黑色 */
        z-index: 9999;
        pointer-events: none;
        display: flex;
        align-items: center;
        justify-content: center;
      `;
      
      // 4. 创建保护图标容器
      const protectionIcon = document.createElement('div');
      protectionIcon.style.cssText = `
        display: flex;
        align-items: center;
        justify-content: center;
        position: relative;
        z-index: 10000;
        pointer-events: none;
      `;
      
      // 添加PTS.svg图标
      const lockIcon = document.createElement('img');
      lockIcon.src = 'PTS.svg';
      lockIcon.alt = 'Protected';
      lockIcon.id = 'protection-lock-icon';
      lockIcon.style.cssText = `
        width: 80px;
        height: 80px;
        z-index: 10001;
        opacity: 0.6;
      `;
      
      // 添加"点击任意位置继续"文字
      const continueTextContainer = document.createElement('div');
      continueTextContainer.id = 'continue-text-container';
      continueTextContainer.style.cssText = `
        position: absolute;
        bottom: -25px;
        color: white;
        font-size: 11px;
        text-shadow: 0 0 30px rgba(255, 255, 255, 0.9);
        white-space: nowrap;
        z-index: 10001;
        opacity: 0.6;
      `;
      continueTextContainer.textContent = '点击任意位置继续';

      // 创建媒体查询样式
      const styleElement = document.createElement('style');
      styleElement.textContent = `
        /* 大屏幕 (桌面) */
        @media (min-width: 1200px) {
          #protection-lock-icon {
            width: 90px !important;
            height: 90px !important;
          }
          #continue-text-container {
            font-size: 16px !important;
            bottom: -35px !important;
          }
        }
        
        /* 中屏幕 (平板) */
        @media (max-width: 1199px) and (min-width: 768px) {
          #protection-lock-icon {
            width: 80px !important;
            height: 80px !important;
          }
          #continue-text-container {
            font-size: 14px !important;
            bottom: -30px !important;
          }
        }
        
        /* 小屏幕 (手机) */
        @media (max-width: 767px) {
          #protection-lock-icon {
            width: 60px !important;
            height: 60px !important;
          }
          #continue-text-container {
            font-size: 12px !important;
            bottom: -25px !important;
          }
        }
      `;
      document.head.appendChild(styleElement);
      
      // 组装元素
      protectionIcon.appendChild(lockIcon);
      protectionIcon.appendChild(continueTextContainer);
      protectionOverlay.appendChild(protectionIcon);
      
      // 5. 将覆盖层添加到document.documentElement，确保不被body的模糊效果影响
      document.documentElement.appendChild(protectionOverlay);
      
      // 6. 如果是截图尝试，添加额外的提示
      if (document._screenshotAttemptDetected) {
        // 添加截图警告文字
        const screenshotWarning = document.createElement('div');
        screenshotWarning.style.cssText = `
          position: absolute;
          top: 50px;
          color: white;
          font-size: 32px;
          font-weight: bold;
          text-shadow: 0 0 20px rgba(255, 255, 255, 0.9);
          z-index: 10001;
        `;
        screenshotWarning.textContent = ' ';
        protectionOverlay.appendChild(screenshotWarning);
        
        // 500ms后重置截图检测标志
        setTimeout(() => {
          document._screenshotAttemptDetected = false;
        }, 500);
      }
    }
  }
  
  // 辅助函数：移除所有保护元素
  function removeProtectionElements() {
    let overlay = document.getElementById('content-protection-overlay');
    if (overlay && overlay.parentNode === document.documentElement) {
      document.documentElement.removeChild(overlay);
    }
    
    let darkOverlay = document.getElementById('dark-overlay');
    if (darkOverlay && darkOverlay.protectionContainer) {
      if (darkOverlay.protectionContainer.parentNode === document.documentElement) {
        document.documentElement.removeChild(darkOverlay.protectionContainer);
      }
    }
    
    let screenshotOverlay = document.getElementById('screenshot-overlay');
    if (screenshotOverlay && screenshotOverlay.parentNode === document.body) {
      document.body.removeChild(screenshotOverlay);
    }
  }
  
  // 初始化截图检测标志
  document._screenshotAttemptDetected = false;
  
  // 页面加载时默认模糊
  if (autoBlur) {
    toBlur();
  }
  
  // 增强的toClear函数 - 在截图尝试期间保持保护
  const originalToClear = toClear;
  window.toClear = function() {
    // 如果没有检测到截图尝试，允许清除模糊效果
    if (!document._screenshotAttemptDetected) {
      originalToClear();
    } else {
      // 截图尝试期间，保持一定程度的保护
      document.body.style.cssText="-webkit-filter: blur(5px);-moz-filter: blur(5px);-ms-filter: blur(5px);-o-filter: blur(5px);filter: blur(5px); transition: filter 0ms;";
    }
  };

  function toClear()
  {
	  // 清除之前的定时器（如果存在）
	  if (window.clearTimeoutId) {
		  clearTimeout(window.clearTimeoutId);
	  }
	  
	  // 设置新的定时器，并保存ID以便后续可能的取消操作
	  window.clearTimeoutId = setTimeout(function() {
	      // 添加过渡效果，实现0.1秒的平滑渐变
	      document.body.style.cssText="-webkit-filter: blur(0px);-moz-filter: blur(0px);-ms-filter: blur(0px);-o-filter: blur(0px);filter: blur(0px); transition: filter 0.1s ease-out;"
        
	      // 移除所有保护元素
	      removeProtectionElements();
	      
	      // 清除定时器ID标志
	      window.clearTimeoutId = null;
	  }, 100); // 0.1秒延迟
  }

  // 增强的焦点监控
  // 鼠标点击页面时清晰
  document.onclick = function(event){
    	toClear();
  }
  
  // 鼠标移动到页面上时清晰
  document.addEventListener('mousemove', function(event){
    	toClear();
  });
  
  // 鼠标离开页面时模糊
  document.onmouseleave = function(event){
	  toBlur();
  }

  // 窗口失去焦点时模糊
  window.addEventListener('blur', function(event){
    	toBlur();
  });

  // 文档失去焦点时模糊
  document.onblur = function(event){
    	toBlur();
  }
  
  // 定时检查焦点状态（每100毫秒）
  setInterval(function(){
    if (document.visibilityState === 'hidden' && autoBlur) {
      toBlur();
    }
  }, 100);

  // 增强的截图快捷键拦截系统
  function handleScreenshotShortcuts(e) {
      if (!noScreenshot) return;
      
      // 标记是否拦截了截图操作
      let intercepted = false;
      
      // 1. Windows/Linux截图快捷键
      // PrintScreen键
      if (e.key === 'PrintScreen' || e.keyCode === 44) {
          intercepted = true;
      }
      // Alt + PrintScreen
      if (e.altKey && (e.key === 'PrintScreen' || e.keyCode === 44)) {
          intercepted = true;
      }
      // Windows键 + PrintScreen
      if (e.metaKey && (e.key === 'PrintScreen' || e.keyCode === 44)) {
          intercepted = true;
      }
      // Windows键 + Shift + S (新版Windows截图工具)
      if (e.metaKey && e.shiftKey && e.key.toLowerCase() === 's') {
          intercepted = true;
      }
      
      // 2. macOS截图快捷键
      // Command + Shift + 3/4/5 (包括新版macOS截图工具)
      if (e.metaKey && e.shiftKey && (e.key === '3' || e.key === '4' || e.key === '5')) {
          intercepted = true;
      }
      // Command + Control + Shift + 3/4/5 (复制到剪贴板)
      if (e.metaKey && e.ctrlKey && e.shiftKey && (e.key === '3' || e.key === '4' || e.key === '5')) {
          intercepted = true;
      }
      
      // 3. 常见第三方软件截图快捷键
      // 微信截图: Alt + A
      if (e.altKey && e.key.toLowerCase() === 'a') {
          intercepted = true;
      }
      // QQ截图: Ctrl + Alt + A
      if (e.ctrlKey && e.altKey && e.key.toLowerCase() === 'a') {
          intercepted = true;
      }
      // 钉钉截图: Ctrl + Shift + A
      if (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === 'a') {
          intercepted = true;
      }
      // Snipaste截图: F1 (默认)
      if (e.keyCode === 112) { // F1
          intercepted = true;
      }
      // 一些浏览器扩展截图工具常用: Ctrl + Shift + E
      if (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === 'e') {
          intercepted = true;
      }
      // 一些系统工具常用: Ctrl + PrtScn
      if (e.ctrlKey && (e.key === 'PrintScreen' || e.keyCode === 44)) {
          intercepted = true;
      }
      
      // 如果检测到截图操作
      if (intercepted) {
          e.preventDefault();
          e.stopPropagation();
          e.stopImmediatePropagation();
          
          // 标记这是一个截图尝试
          document._screenshotAttemptDetected = true;
          
          // 立即清空剪贴板
          if (navigator.clipboard && navigator.clipboard.writeText) {
              navigator.clipboard.writeText('');
          }
          
          // 延迟再次清空剪贴板，确保系统截图工具完成后也能清空
          setTimeout(() => {
              if (navigator.clipboard && navigator.clipboard.writeText) {
                  navigator.clipboard.writeText('');
              }
          }, 300);
          
          // 触发页面模糊效果（现在会应用额外的覆盖层）
          toBlur();
          
          // 短暂显示提示信息（可选）
          // showScreenshotBlockedMessage();
          
          return false;
      }
      
      return true;
  }
  
  // 在keyup事件中监听截图快捷键
  document.addEventListener('keyup', handleScreenshotShortcuts, true);
  
  // 合并所有keydown事件监听器为一个，提高响应速度
  document.addEventListener('keydown', function(e) {
      // 1. 处理截图快捷键
      const screenshotHandled = handleScreenshotShortcuts(e);
      if (!screenshotHandled) {
          return false;
      }
      
      // 2. 处理Ctrl/Command键按下事件，触发页面模糊
      if ((e.ctrlKey || e.metaKey) && (noCopy || noScreenshot)) {
          toBlur();
      }
      
      // 3. 处理打印快捷键
      if ((e.ctrlKey || e.metaKey) && e.key == 'p' && noPrint) {
          e.cancelBubble = true;
          e.preventDefault();
          e.stopImmediatePropagation();
          return false;
      }
      
      // 4. 处理shift、alt/option和数字1-9键按下事件
      if (e.shiftKey || e.altKey || /^[1-9]$/.test(e.key)) {
          toBlur();
      }
      
      return true;
  }, true);

  // 禁止网页另存为功能
  if (typeof noSaveAs !== 'undefined' && noSaveAs) {
      // Ctrl+S/Cmd+S保存快捷键的禁用已经在主keydown监听器中处理
      // 这里不再重复添加监听器，提高性能
      
      // 添加document.oncontextmenu事件（如果之前没有的话）
      if (noCopy) {
          // 右键菜单已经被禁用，这里就不再重复设置
      } else {
          // 如果noCopy为false，但noSaveAs为true，也需要禁用右键菜单中的"另存为"选项
          document.addEventListener('contextmenu', function(e) {
              e.preventDefault();
              return false;
          }, true);
      }
  }

  // 禁止开发者工具功能
  if (typeof noDevTools !== 'undefined' && noDevTools) {
      // 开发者工具检测和快捷键拦截
      // 定义一个统一的键盘事件处理函数
      function handleAllKeyEvents(e) {
          // 1. 检查是否是开发者工具快捷键
          let isDevToolsShortcut = false;
          if (e.keyCode === 123 || // F12
              (e.ctrlKey && e.shiftKey && e.keyCode === 73) || // Ctrl+Shift+I
              (e.ctrlKey && e.shiftKey && e.keyCode === 74) || // Ctrl+Shift+J
              (e.ctrlKey && e.keyCode === 85) || // Ctrl+U
              (e.metaKey && e.altKey && e.keyCode === 73)) { // Command+Option+I
              isDevToolsShortcut = true;
          }
          
          if (isDevToolsShortcut) {
              e.preventDefault();
              e.stopPropagation();
              e.stopImmediatePropagation();
              toBlur();
              return false;
          }
          
          // 2. 处理截图快捷键
          const screenshotHandled = handleScreenshotShortcuts(e);
          if (!screenshotHandled) {
              return false;
          }
          
          // 3. 处理Ctrl/Command键按下事件
          if ((e.ctrlKey || e.metaKey) && (noCopy || noScreenshot)) {
              toBlur();
          }
          
          // 4. 处理打印快捷键
          if ((e.ctrlKey || e.metaKey) && e.key == 'p' && noPrint) {
              e.cancelBubble = true;
              e.preventDefault();
              e.stopImmediatePropagation();
              return false;
          }
          
          // 5. 处理shift、alt/option和数字1-9键按下事件
          if (e.shiftKey || e.altKey || /^[1-9]$/.test(e.key)) {
              toBlur();
          }
          
          // 6. 处理保存快捷键
          if (typeof noSaveAs !== 'undefined' && noSaveAs && 
              (e.ctrlKey || e.metaKey) && (e.keyCode === 83 || e.key.toLowerCase() === 's')) {
              e.preventDefault();
              e.stopPropagation();
              e.stopImmediatePropagation();
              return false;
          }
          
          return true;
      }
      
      // 我们不再使用克隆节点的方法移除事件监听器，因为这会导致页面无法恢复清晰度
      // 而是直接添加我们的统一事件处理函数，让它与现有的事件监听器共存
      // 这样可以确保页面恢复清晰度的交互事件继续工作
      
      // 重新添加截图快捷键的keyup监听
      document.addEventListener('keyup', handleScreenshotShortcuts, true);
      
      // 添加统一的keydown事件处理函数
      document.addEventListener('keydown', handleAllKeyEvents, true);
  } else {
      // 如果没有启用开发者工具保护，确保原始的键盘事件处理正常工作
      // 定义一个轻量级的键盘事件处理函数
      function handleBasicKeyEvents(e) {
          // 处理截图快捷键
          const screenshotHandled = handleScreenshotShortcuts(e);
          if (!screenshotHandled) {
              return false;
          }
          
          // 处理Ctrl/Command键按下事件
          if ((e.ctrlKey || e.metaKey) && (noCopy || noScreenshot)) {
              toBlur();
          }
          
          // 处理打印快捷键
          if ((e.ctrlKey || e.metaKey) && e.key == 'p' && noPrint) {
              e.cancelBubble = true;
              e.preventDefault();
              e.stopImmediatePropagation();
              return false;
          }
          
          // 处理shift、alt/option和数字1-9键按下事件
          if (e.shiftKey || e.altKey || /^[1-9]$/.test(e.key)) {
              toBlur();
          }
          
          // 处理保存快捷键
          if (typeof noSaveAs !== 'undefined' && noSaveAs && 
              (e.ctrlKey || e.metaKey) && (e.keyCode === 83 || e.key.toLowerCase() === 's')) {
              e.preventDefault();
              e.stopPropagation();
              e.stopImmediatePropagation();
              return false;
          }
          
          return true;
      }
      
      // 确保我们的轻量级处理器被添加
      document.addEventListener('keydown', handleBasicKeyEvents, true);
      
      // 检测开发者工具打开的其他方法
      // 1. 检测窗口大小变化（开发工具打开会改变窗口尺寸）
      let lastWindowSize = { width: window.innerWidth, height: window.innerHeight };
      setInterval(function() {
          let currentSize = { width: window.innerWidth, height: window.innerHeight };
          if (Math.abs(currentSize.width - lastWindowSize.width) > 100 || Math.abs(currentSize.height - lastWindowSize.height) > 100) {
              toBlur();
          }
          lastWindowSize = currentSize;
      }, 1000);
      
      // 2. 检测元素选择状态变化（开发工具中选择元素会触发）
      let elementSelectCheck = 0;
      document.addEventListener('selectionchange', function() {
          elementSelectCheck++;
          if (elementSelectCheck > 10) { // 短时间内多次触发选择可能是开发工具在操作
              toBlur();
              elementSelectCheck = 0;
          }
          // 重置计数器
          setTimeout(function() {
              elementSelectCheck = Math.max(0, elementSelectCheck - 1);
          }, 500);
      });
  }
});