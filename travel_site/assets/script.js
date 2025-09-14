// ==================== 数据定义区域 ====================
// 目的地数据
const destinations = [
  { id: 1, name: '成都', country: '中国', days: 4, cover: 'assets/images/other_images/d1.png' },
  { id: 2, name: '清迈', country: '泰国', days: 5, cover: 'assets/images/other_images/d2.png' },
  { id: 3, name: '首尔', country: '韩国', days: 4, cover: 'assets/images/other_images/d3.jpg' },
  { id: 4, name: '北海道', country: '日本', days: 6, cover: 'assets/images/other_images/d4.png' },
  { id: 5, name: '巴厘岛', country: '印尼', days: 5, cover: 'assets/images/other_images/d5.png' },
  { id: 6, name: '土耳其', country: '土耳其', days: 7, cover: 'assets/images/other_images/d6.png' }
]

// 特惠套餐数据
const deals = [
  { id: 'd1', title: '大阪5日自由行', price: 2999, cover: 'assets/images/other_images/t1.png' },
  { id: 'd2', title: '新加坡3晚机酒', price: 2599, cover: 'assets/images/other_images/t2.png' },
  { id: 'd3', title: '新疆环线8日小团', price: 5899, cover: 'assets/images/other_images/t3.png' }
]

// ==================== 工具函数区域 ====================
// 获取正确的资源路径
function getAssetPath(path) {
  // 检查当前页面是否在子目录中
  const isInSubDir = window.location.pathname.includes('/destinations/') || 
                     window.location.pathname.includes('/pages/') ||
                     window.location.pathname.includes('/guides/')
  
  if (isInSubDir) {
    return `../${path}`
  } else {
    return `travel_site/${path}`
  }
}

// 节流函数
function throttle(fn, wait){
  let last = 0
  return function(...args){
    const now = Date.now()
    if(now - last >= wait){
      last = now
      fn.apply(this, args)
    }
  }
}

// 图片加载失败占位符
const fallbackSvg = encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="800">
  <defs>
    <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#1e293b"/>
      <stop offset="100%" stop-color="#0b0f19"/>
    </linearGradient>
  </defs>
  <rect width="100%" height="100%" fill="url(#g)"/>
  <g fill="#9aa5b1" font-family="sans-serif" font-size="36">
    <text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle">图片加载失败</text>
  </g>
</svg>`)
const fallbackDataUri = `data:image/svg+xml;charset=UTF-8,${fallbackSvg}`

// 生成图片标签
function imageTag(src, alt){
  const correctSrc = getAssetPath(src)
  return `<img loading="lazy" decoding="async" src="${correctSrc}" alt="${alt}"
    onerror="this.onerror=null;this.src='${fallbackDataUri}'">`
}

// ==================== 渲染函数区域 ====================
// 渲染目的地卡片
function renderDestinations(list){
  const grid = document.querySelector('#destinationGrid')
  if (!grid) return
  
  grid.innerHTML = ''
  
  list.forEach(item => {
    const article = document.createElement('article')
    article.className = 'card'
    article.setAttribute('data-id', item.id)
    
    const media = document.createElement('div')
    media.className = 'media'
    media.innerHTML = imageTag(item.cover, item.name)
    
    const body = document.createElement('div')
    body.className = 'body'
    
    const title = document.createElement('h3')
    title.className = 'title'
    title.innerText = item.name
    
    const meta = document.createElement('div')
    meta.className = 'meta'
    meta.innerHTML = `<span>${item.country}</span><span>${item.days}天</span>`
    
    body.appendChild(title)
    body.appendChild(meta)
    
    article.appendChild(media)
    article.appendChild(body)
    
    article.addEventListener('click', () => {
      const isInSubDir = window.location.pathname.includes('/destinations/') || 
                         window.location.pathname.includes('/pages/') ||
                         window.location.pathname.includes('/guides/')
      window.location.href = `${isInSubDir ? '../' : 'travel_site/'}destinations/destination.html?id=${item.id}&name=${encodeURIComponent(item.name)}`
    })
    
    grid.appendChild(article)
  })
}

// 渲染优惠套餐卡片
function renderDeals(){
  const grid = document.querySelector('#dealGrid')
  if(!grid) {
    console.error('dealGrid元素未找到');
    return;
  }
  
  if(!deals || deals.length === 0) {
    console.error('deals数据为空或未定义');
    const errorMsg = document.createElement('p')
    errorMsg.style.textAlign = 'center'
    errorMsg.style.color = 'red'
    errorMsg.innerText = '数据加载失败'
    grid.appendChild(errorMsg)
    return;
  }
  
  grid.innerHTML = ''
  
  deals.forEach(deal => {
    const article = document.createElement('article')
    article.className = 'card deal'
    article.setAttribute('data-id', deal.id)
    
    const media = document.createElement('div')
    media.className = 'media'
    media.innerHTML = imageTag(deal.cover, deal.title)
    
    const body = document.createElement('div')
    body.className = 'body'
    
    const title = document.createElement('h3')
    title.className = 'title'
    title.innerText = deal.title
    
    const meta = document.createElement('p')
    meta.className = 'meta'
    meta.innerText = '含往返机票＋酒店 · 税费全含'
    
    body.appendChild(title)
    body.appendChild(meta)
    
    const price = document.createElement('div')
    price.className = 'price'
    
    const priceText = document.createElement('strong')
    priceText.innerText = `¥${deal.price}`
    
    const bookBtn = document.createElement('a')
    bookBtn.href = '#'
    bookBtn.innerText = '预订'
    bookBtn.addEventListener('click', (e) => {
      e.preventDefault()
      if (!checkLoginStatus(window.location.href)) return
      window.location.href = `travel_site/pages/book.html?name=${encodeURIComponent(deal.title)}`
    })
    
    price.appendChild(priceText)
    price.appendChild(bookBtn)
    
    article.appendChild(media)
    article.appendChild(body)
    article.appendChild(price)
    
    grid.appendChild(article)
  })
}

// ==================== 滚动和导航功能 ====================
// 平滑滚动和回到顶部功能设置
function setupSmoothScroll(){
  // 锚点滚动功能 - 处理页面内锚点链接的平滑滚动
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', e => {
      const targetId = link.getAttribute('href')  // 获取目标锚点ID
      if(!targetId || targetId === '#') return  // 如果无效则返回
      const target = document.querySelector(targetId)  // 查找目标元素
      if(target){
        e.preventDefault()  // 阻止默认跳转行为
        const top = target.getBoundingClientRect().top + window.scrollY - 10  // 计算目标位置（减去10px偏移）
        window.scrollTo({ top, behavior: 'smooth' })  // 平滑滚动到目标位置
        history.pushState(null, '', targetId)  // 更新浏览器地址栏
      }
    })
  })
  
  // 创建回到顶部按钮
  const backToTopBtn = document.createElement('button')
  backToTopBtn.id = 'backToTop'  // 设置按钮ID
  backToTopBtn.innerHTML = '↑'  // 设置按钮内容为向上箭头
  backToTopBtn.setAttribute('aria-label', '回到顶部')  // 设置无障碍标签
  // 设置按钮样式（内联样式确保立即生效）
  backToTopBtn.style.cssText = `
    position: fixed;
    bottom: 20px;
    right: 20px;
    width: 50px;
    height: 50px;
    border-radius: 50%;
    background: var(--accent, #007bff);
    color: white;
    border: none;
    cursor: pointer;
    font-size: 20px;
    z-index: 1000;
    opacity: 0;
    visibility: hidden;
    transition: all 0.3s ease;
    box-shadow: 0 2px 10px rgba(0,0,0,0.2);
  `
  
  document.body.appendChild(backToTopBtn)  // 将按钮添加到页面
  
  // 滚动时显示/隐藏按钮 - 监听页面滚动事件
  window.addEventListener('scroll', () => {
    if (window.scrollY > 300) {  // 当滚动超过300px时显示按钮
      backToTopBtn.style.opacity = '1'
      backToTopBtn.style.visibility = 'visible'
    } else {  // 否则隐藏按钮
      backToTopBtn.style.opacity = '0'
      backToTopBtn.style.visibility = 'hidden'
    }
  })
  
  // 点击回到顶部 - 点击按钮时平滑滚动到页面顶部
  backToTopBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  })
}

// ==================== 首页背景轮播功能 ====================
// 首页背景轮播设置 - 实现无缝背景图片切换效果
function setupHeroSlideshow(){
  const bg1 = document.getElementById('heroBg1')  
  const bg2 = document.getElementById('heroBg2')  
  if(!bg1 || !bg2) return  // 如果容器不存在则返回
  
  // 轮播图片数组
  const images = [
    getAssetPath('assets/images/other_images/b1.png'),
    getAssetPath('assets/images/other_images/b2.png'),
    getAssetPath('assets/images/other_images/b3.png')
  ]
  let idx = 0  // 当前图片索引
  let showingFirst = true  // 当前显示的是第一个背景容器
  const dotsWrap = document.getElementById('heroDots')  // 获取指示点容器
  
  // 创建指示点按钮
  if(dotsWrap){ 
    dotsWrap.innerHTML = images.map((_,i)=>`<button class="hero-dot" role="tab" aria-selected="${i===0}" aria-label="切换到第${i+1}张"></button>`).join('') 
  }
  
  // 更新指示点状态
  const updateDots = () => {
    if(!dotsWrap) return
    const dots = Array.from(dotsWrap.children)  // 获取所有指示点
    dots.forEach((d,i)=>{ 
      d.classList.toggle('active', i === ((idx-1+images.length)%images.length))  // 设置激活状态
      d.setAttribute('aria-selected', String(i === ((idx-1+images.length)%images.length)))  // 设置无障碍属性
    })
  }
  
  // 应用下一张图片
  const apply = () => {
    const nextUrl = images[idx % images.length]  // 获取下一张图片URL
    const el = showingFirst ? bg2 : bg1  // 选择要更新的背景容器
    el.style.backgroundImage = `url('${nextUrl}')`  // 设置背景图片
    requestAnimationFrame(() => {
      el.classList.add('active')  // 添加激活类
      ;(showingFirst ? bg1 : bg2).classList.remove('active')  // 移除另一个容器的激活类
      showingFirst = !showingFirst  // 切换显示状态
    })
    idx++  // 递增索引
    updateDots()  // 更新指示点
  }
  
  // 初始化第一张图片
  bg1.style.backgroundImage = `url('${images[0]}')`
  bg1.classList.add('active')
  idx = 1  // 设置下一个索引
  updateDots()  // 更新指示点
  
  // 设置定时器 - 4秒后开始轮播，之后每8秒切换一次
  setTimeout(apply, 4000)
  setInterval(apply, 8000)
}

// ==================== 搜索功能 ====================
// 搜索交互设置 - 实现实时搜索和搜索提交功能
function setupSearch(){
  const form = document.getElementById('searchForm')  
  const input = document.getElementById('keyword')  
  const hint = document.getElementById('searchHint')  

  // 执行搜索过滤（使用节流函数优化性能）
  const doFilter = throttle(() => {
    const q = input.value.trim().toLowerCase()  // 获取搜索关键词并转换为小写
    const filtered = destinations.filter(d =>
      d.name.toLowerCase().includes(q) || d.country.toLowerCase().includes(q)  // 过滤目的地名称或国家
    )
    renderDestinations(filtered)  // 渲染过滤后的结果
    hint.textContent = q ? `为您找到 ${filtered.length} 个结果` : ''  // 显示搜索结果数量
  }, 200)  // 200ms节流延迟

  // 监听输入框输入事件
  input.addEventListener('input', doFilter)
  
  // 监听表单提交事件
  form.addEventListener('submit', e => {
    e.preventDefault()  
    const q = input.value.trim()  // 获取搜索关键词
    // 跳转到目的地列表页面并携带搜索参数
    const isInSubDir = window.location.pathname.includes('/destinations/') || 
                       window.location.pathname.includes('/pages/') ||
                       window.location.pathname.includes('/guides/')
    location.href = `${isInSubDir ? '../' : 'travel_site/'}destinations/destinations.html?q=${encodeURIComponent(q)}`
  })
}

// ==================== 热门搜索词跑马灯功能 ====================
// 热词跑马灯设置 - 实现滚动展示热门搜索词
function setupHotwords(){
  const container = document.getElementById('hotwordsMarquee')  
  if(!container) return  // 如果容器不存在则返回
  const track = document.getElementById('hotwordsTrack')  
  const words = ['冰岛','清迈','成都','北海道','首尔','巴厘岛','亲子游','小众海岛','美食','徒步','自驾']  
  
  // 生成两份以实现无缝滚动
  const renderWords = () => words.map(w => `<span class="hotword" data-word="${w}"># ${w}</span>`).join('')
  track.innerHTML = renderWords() + renderWords()  // 重复生成内容实现无缝循环

  // 悬停减速功能
  let slow = false  // 减速状态标志
  const setSpeed = () => { track.style.animationDuration = slow ? '36s' : '18s' }  // 设置动画速度
  setSpeed()  // 初始化速度
  container.addEventListener('mouseenter', () => { slow = true; setSpeed() })  
  container.addEventListener('mouseleave', () => { slow = false; setSpeed() })  // 鼠标离开时恢复速度
  
  // 触控暂停与拖动功能
  let startX = 0, startLeft = 0, dragging = false  // 触控相关变量
  const getTranslateX = () => new DOMMatrixReadOnly(getComputedStyle(track).transform).m41 || 0  // 获取当前变换位置
  
  // 触控开始事件
  container.addEventListener('touchstart', e => {
    dragging = true  // 设置拖拽状态
    slow = true; setSpeed()  // 减速
    startX = e.touches[0].clientX  // 记录起始X坐标
    startLeft = getTranslateX()  // 记录起始位置
  }, { passive: true })
  
  // 触控移动事件
  container.addEventListener('touchmove', e => {
    if(!dragging) return  // 如果不在拖拽状态则返回
    const dx = e.touches[0].clientX - startX  // 计算移动距离
    track.style.animation = 'none'  // 暂停动画
    track.style.transform = `translateX(${startLeft + dx}px)`  // 手动设置位置
  }, { passive: true })
  
  // 触控结束事件
  container.addEventListener('touchend', () => {
    dragging = false  // 取消拖拽状态
    track.style.animation = ''  // 恢复动画
    slow = false; setSpeed()  // 恢复速度
  })

  // 点击自动填充并跳转功能
  track.addEventListener('click', e => {
    const tag = e.target.closest('.hotword')  // 查找点击的热词元素
    if(!tag) return  
    const word = tag.dataset.word  
    const input = document.getElementById('keyword') 
    if(input){ input.value = word }  // 自动填充搜索框
    
    const destinationNames = destinations.map(d => d.name)  // 获取所有目的地名称
    const hotwordRoutes = { '亲子游':'travel_site/pages/deals.html', '小众海岛':'travel_site/pages/deals.html', '美食':'travel_site/pages/deals.html' }  // 特殊热词路由映射
    const isDestination = destinationNames.includes(word)  // 判断是否为目的地名称
    
    // 特殊处理巴厘岛，直接跳转到详情页面
    if(word === '巴厘岛') {
      const baliDestination = destinations.find(d => d.name === '巴厘岛')
      if(baliDestination) {
        const isInSubDir = window.location.pathname.includes('/destinations/') || 
                           window.location.pathname.includes('/pages/') ||
                           window.location.pathname.includes('/guides/')
        location.href = `${isInSubDir ? '../' : 'travel_site/'}destinations/destination.html?id=${baliDestination.id}&name=${encodeURIComponent(baliDestination.name)}`
        return
      }
    }
    
    // 特殊处理成都，直接跳转到详情页面
    if(word === '成都') {
      const chengduDestination = destinations.find(d => d.name === '成都')
      if(chengduDestination) {
        const isInSubDir = window.location.pathname.includes('/destinations/') || 
                           window.location.pathname.includes('/pages/') ||
                           window.location.pathname.includes('/guides/')
        location.href = `${isInSubDir ? '../' : 'travel_site/'}destinations/destination.html?id=${chengduDestination.id}&name=${encodeURIComponent(chengduDestination.name)}`
        return
      }
    }
    
    // 根据热词类型决定跳转目标
    const isInSubDir = window.location.pathname.includes('/destinations/') || 
                       window.location.pathname.includes('/pages/') ||
                       window.location.pathname.includes('/guides/')
    const basePath = isInSubDir ? '../' : 'travel_site/'
    const target = hotwordRoutes[word] || (isDestination ? `${basePath}destinations/destinations.html` : `${basePath}destinations/destinations.html`)
    location.href = `${target}?q=${encodeURIComponent(word)}`  // 跳转并携带搜索参数
  })
}

// ==================== 移动端导航功能 ====================
// 移动端菜单设置 - 实现汉堡包菜单的开关功能
function setupNav(){
  const toggle = document.getElementById('navToggle')  
  const menu = document.getElementById('navMenu')  
  // 检查必要的DOM元素是否存在
  if(!toggle || !menu) {
    console.error('导航元素未找到')
    return
  }
  
  // 菜单切换按钮点击事件
  toggle.addEventListener('click', () => {
    const open = menu.classList.toggle('open')  // 切换菜单打开/关闭状态
    toggle.setAttribute('aria-expanded', String(open))  // 更新无障碍属性
  })

  // 菜单链接点击事件 - 点击链接后自动关闭菜单
  menu.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
    menu.classList.remove('open')  // 关闭菜单
    toggle.setAttribute('aria-expanded', 'false')  // 更新无障碍属性
  }))
}

// ==================== 邮件订阅功能 ====================
// 订阅表单校验设置 - 实现邮箱订阅功能
function setupSubscribe(){
  const form = document.getElementById('subscribeForm')  
  const email = document.getElementById('email')  
  const msg = document.getElementById('subscribeMsg') 
  
  // 监听表单提交事件
  form.addEventListener('submit', e => {
    e.preventDefault()  // 阻止默认提交行为
    const value = email.value.trim()  // 获取邮箱值并去除空格
    const ok = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)  // 使用正则表达式验证邮箱格式
    
    // 如果邮箱格式不正确
    if(!ok){
      msg.textContent = '请输入有效的邮箱地址'
      msg.style.color = '#ff8080'  // 设置错误颜色
      return
    }
    
    // 订阅成功处理
    msg.textContent = '订阅成功！感谢关注～'
    msg.style.color = 'var(--accent)'  // 设置成功颜色
    email.value = ''  // 清空输入框
  })
}

// ==================== 工具函数 ====================
// 设置年份显示
function setYear(){
  const yearEl = document.getElementById('year')  // 获取年份显示元素
  yearEl.textContent = new Date().getFullYear()  // 设置当前年份
}

// ==================== 本地存储封装 ====================
// 本地存储工具对象 - 提供安全的localStorage操作
const storage = {
  // 获取存储数据
  get(key, fallback){
    try{ 
      return JSON.parse(localStorage.getItem(key)) ?? fallback  // 尝试解析JSON，失败则返回默认值
    }catch{ 
      return fallback  // 解析失败时返回默认值
    }
  },
  // 设置存储数据
  set(key, value){ 
    localStorage.setItem(key, JSON.stringify(value))  // 将数据序列化为JSON存储
  }
}

// ==================== 用户认证系统 ====================
// 获取当前登录用户
function currentUser(){ 
  // 优先从sessionStorage获取，如果没有则从localStorage获取
  const sessionUser = sessionStorage.getItem('currentUser');
  if (sessionUser) {
    return JSON.parse(sessionUser);
  }
  return storage.get('current_user', null)  // 从本地存储获取当前用户信息
}

// 检查用户是否已登录
function isLoggedIn(){
  return currentUser() !== null  // 判断当前用户是否存在
}

// 获取用户数据
function getUserData(userId){
  return storage.get(`user_${userId}`, {  // 从本地存储获取用户数据，如果不存在则返回默认结构
    favorites: [],  // 收藏列表
    orders: [],  // 订单列表
    profile: {}  // 个人资料
  })
}

// 保存用户数据
function saveUserData(userId, data){
  storage.set(`user_${userId}`, data)  // 将用户数据保存到本地存储
}

// 更新认证链接显示
function updateAuthLink(){
  const authLink = document.getElementById('authLink')  // 获取认证链接元素
  const profileLink = document.getElementById('profileLink')  // 获取个人中心链接元素
  const user = currentUser()  // 获取当前用户
  
  if(user){
    // 用户已登录
    if(authLink) {
      authLink.textContent = `${user.username || user.email}`  // 显示用户名或邮箱
      authLink.href = 'profile.html'  
    }
    if(profileLink) {
      profileLink.style.display = 'block'  // 显示个人中心链接
    }
  } else {
    // 用户未登录
    if(authLink) {
      authLink.textContent = '登录'  
      authLink.href = 'login.html'  
    }
    if(profileLink) {
      profileLink.style.display = 'none'  // 隐藏个人中心链接
    }
  }
}

// 用户登出
function logout(){
  localStorage.removeItem('current_user')  // 清除当前用户信息
  sessionStorage.removeItem('currentUser')  // 清除会话用户信息
  
  // 清除所有用户相关数据
  Object.keys(localStorage).forEach(key => {
    if(key.startsWith('user_') && key !== 'users'){  // 清除用户数据但保留用户列表
      localStorage.removeItem(key)
    }
  })
  
  // 更新导航栏状态
  updateAuthLink()
  location.reload()  // 重新加载页面
}

// ==================== Toast提示功能 ====================
// 显示Toast提示消息
function showToast(message, type = 'success'){
  // 移除已存在的toast（避免重复显示）
  const existingToast = document.querySelector('.toast')
  if(existingToast) existingToast.remove()
  
  // 创建Toast元素
  const toast = document.createElement('div')
  toast.className = `toast toast-${type}`  // 设置Toast样式类
  toast.textContent = message 
  
  document.body.appendChild(toast)  // 添加到页面
  
  // 显示动画 - 延迟100ms后添加show类
  setTimeout(() => toast.classList.add('show'), 100)
  
  // 自动隐藏 - 3秒后开始隐藏动画
  setTimeout(() => {
    toast.classList.remove('show')  // 移除show类触发隐藏动画
    setTimeout(() => toast.remove(), 300)  // 300ms后完全移除元素
  }, 3000)
}


// 表单验证工具函数
function validateForm() {
  return {
    // 手机号正则验证
    validatePhone: (phone) => {
      const phoneRegex = /^1[3-9]\d{9}$/
      return phoneRegex.test(phone)
    },
    
    // 密码长度验证
    validatePassword: (password) => {
      return password.length >= 6
    },
    
    // 邮箱格式验证
    validateEmail: (email) => {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      return emailRegex.test(email)
    },
    
    // 显示错误信息
    showError: (element, message) => {
      element.classList.add('error')
      element.setAttribute('aria-invalid', 'true')
      const errorMsg = element.parentNode.querySelector('.error-msg') || document.createElement('div')
      errorMsg.className = 'error-msg'
      errorMsg.innerText = message
      errorMsg.style.color = '#ff8080'
      errorMsg.style.fontSize = '12px'
      errorMsg.style.marginTop = '4px'
      if (!element.parentNode.querySelector('.error-msg')) {
        element.parentNode.appendChild(errorMsg)
      }
    },
    
    // 清除错误信息
    clearError: (element) => {
      element.classList.remove('error')  
      element.setAttribute('aria-invalid', 'false')  // 设置无障碍属性为false
      const errorMsg = element.parentNode.querySelector('.error-msg')  // 查找错误信息元素
      if (errorMsg) {
        errorMsg.remove()  // 移除错误信息元素
      }
    }
  }
}

// ==================== 认证页面设置 ====================
// 重新实现的认证页面设置 - 处理登录和注册表单
function setupAuthPages(){
  const page = document.body.dataset.page  // 获取当前页面类型
  const validator = validateForm()  // 获取表单验证工具
  
  // 处理登录页面
  if(page === 'login'){
    const form = document.querySelector('#loginForm')  
    const account = document.querySelector('#loginAccount')  
    const pwd = document.querySelector('#loginPwd')  // 获取密码输入框
    const msg = document.querySelector('#loginMsg')  // 获取消息提示元素
    
    // 检查必要的DOM元素是否存在
    if(!form || !account || !pwd || !msg) {
      console.error('登录页面必要的DOM元素未找到')
      return
    }
    
    // 实时验证
    account.addEventListener('input', () => {
      validator.clearError(account)
    })
    
    pwd.addEventListener('input', () => {
      validator.clearError(pwd)
      if (pwd.value.length > 0 && !validator.validatePassword(pwd.value)) {
        validator.showError(pwd, '密码至少6位')
      }
    })
    
    form.addEventListener('submit', e => {
      e.preventDefault()
      let hasError = false
      
      // 验证密码
      if (!validator.validatePassword(pwd.value)) {
        validator.showError(pwd, '密码至少6位')
        hasError = true
      }
      
      if (hasError) return
      
      const users = storage.get('users', [])
      const value = account.value.trim()
      const found = users.find(u => (u.email === value || u.phone === value || u.username === value) && u.pwd === pwd.value)
      
      if(found){ 
        // 保存当前用户信息
        storage.set('current_user', { 
          id: found.id,
          email: found.email, 
          phone: found.phone,
          username: found.username,
          registerTime: found.registerTime
        })
        
        // 显示登录成功弹窗
        alert('登录成功！欢迎回来！')
        const back = sessionStorage.getItem('back_url')
        if(back){ 
          console.log('跳转到返回URL:', back)
          sessionStorage.removeItem('back_url')
          window.location.href = back 
        } else { 
          const homeUrl = '../../index.html'
          console.log('跳转到首页:', homeUrl)
          console.log('当前页面URL:', window.location.href)
          
          // 使用多种方法确保跳转成功
          try {
            window.location.href = homeUrl
          } catch (e) {
            console.error('跳转失败，尝试备用方法:', e)
            window.location.assign(homeUrl)
          }
        }
      }
      else { 
        msg.innerText = '用户名或密码错误'
        msg.style.color = '#ff8080'
      }
    })
  }
  
  if(page === 'register'){
    const form = document.querySelector('#registerForm')
    const username = document.querySelector('#regUsername')
    const email = document.querySelector('#regEmail')
    const phone = document.querySelector('#regPhone')
    const pwd = document.querySelector('#regPwd')
    const msg = document.querySelector('#registerMsg')
    const smsRow = document.querySelector('#smsRow')
    const sendBtn = document.querySelector('#sendCodeBtn')
    const codeInput = document.querySelector('#regCode')

    if(!form || !username || !email || !phone || !pwd || !msg || !smsRow) {
      console.error('注册页面必要的DOM元素未找到')
      return
    }

    // 实时验证用户名
    username.addEventListener('input', () => {
      validator.clearError(username)
      if (username.value.length > 0 && username.value.length < 2) {
        validator.showError(username, '用户名至少2位')
      }
    })

    // 实时验证邮箱
    email.addEventListener('input', () => {
      validator.clearError(email)
      if (email.value.length > 0 && !validator.validateEmail(email.value)) {
        validator.showError(email, '请输入正确的邮箱格式')
      }
    })

    // 实时验证手机号
    phone.addEventListener('input', () => {
      validator.clearError(phone)
      const hasPhone = phone.value.trim().length > 0
      smsRow.style.display = hasPhone ? '' : 'none'
      
      if (phone.value.length > 0 && !validator.validatePhone(phone.value)) {
        validator.showError(phone, '请输入正确的手机号格式')
      }
    })

    // 实时验证密码
    pwd.addEventListener('input', () => {
      validator.clearError(pwd)
      if (pwd.value.length > 0 && !validator.validatePassword(pwd.value)) {
        validator.showError(pwd, '密码至少6位')
      }
    })
    
    // 发送验证码按钮
    if(sendBtn){
      sendBtn.addEventListener('click', () => {
        const p = phone.value.trim()
        if(!p){ 
          alert('请先输入手机号')
          return 
        }
        if (!validator.validatePhone(p)) {
          validator.showError(phone, '请输入正确的手机号格式')
          return
        }
        // 生成4位验证码
        const code = String(Math.floor(1000 + Math.random()*9000))
        sessionStorage.setItem('sms_code', code)
        alert('验证码：' + code)
      })
    }

    form.addEventListener('submit', e => {
      e.preventDefault()
      const usernameValue = username.value.trim()
      const emailValue = email.value.trim()
      const phoneValue = phone.value.trim()
      const pwdValue = pwd.value
      
      // 验证输入
      if(!usernameValue){ 
        msg.textContent = '请输入用户名'
        msg.style.color = '#ff8080'
        return 
      }
      if(!emailValue && !phoneValue){ 
        msg.textContent = '请至少输入邮箱或手机号'
        msg.style.color = '#ff8080'
        return 
      }
      if(pwdValue.length < 6){ 
        msg.textContent = '密码至少6位'
        msg.style.color = '#ff8080'
        return 
      }
      
      const users = storage.get('users', [])
      
      // 检查重复
      if(users.some(u => u.username === usernameValue)){ 
        msg.textContent = '该用户名已存在'
        msg.style.color = '#ff8080'
        return 
      }
      if(emailValue && users.some(u => u.email === emailValue)){ 
        msg.textContent = '该邮箱已注册'
        msg.style.color = '#ff8080'
        return 
      }
      if(phoneValue && users.some(u => u.phone === phoneValue)){ 
        msg.textContent = '该手机号已注册'
        msg.style.color = '#ff8080'
        return 
      }
      
      // 验证手机验证码
      if(phoneValue){
        const code = sessionStorage.getItem('sms_code')
        if(!code || codeInput.value.trim() !== code){ 
          msg.textContent = '验证码不正确'
          msg.style.color = '#ff8080'
          return 
        }
      }
      
      // 创建新用户
      const userId = 'user_' + Date.now()
      const newUser = {
        id: userId,
        username: usernameValue,
        email: emailValue,
        phone: phoneValue,
        pwd: pwdValue,
        registerTime: new Date().toISOString()
      }
      
      users.push(newUser)
      storage.set('users', users)
      
      // 初始化用户数据
      saveUserData(userId, {
        favorites: [],
        orders: [],
        profile: {
          username: newUser.username,
          email: newUser.email,
          phone: newUser.phone,
          registerTime: newUser.registerTime
        }
      })
      
      // 显示注册成功弹窗
      alert('注册成功！账号创建成功，请登录')
      location.href = 'login.html'
    })
  }
}

// 用户隔离的收藏功能
function toggleFavorite(item, type = 'destination'){
  const user = currentUser()
  if(!user) {
    alert('请先登录后再收藏')
    return
  }
  
  const userData = getUserData(user.id)
  const exists = userData.favorites.find(f => f.id === item.id)
  
  if(exists) {
    // 取消收藏
    userData.favorites = userData.favorites.filter(f => f.id !== item.id)
    showToast('已取消收藏')
  } else {
    // 添加收藏
    const favoriteItem = {
      ...item,
      type: type,
      addedAt: new Date().toISOString()
    }
    userData.favorites = [...userData.favorites, favoriteItem]
    showToast('已添加到收藏')
  }
  
  saveUserData(user.id, userData)
  
  // 更新收藏按钮状态
  updateFavoriteButton(item.id, !exists)
}

function renderFavorites(){
  const page = document.body.dataset.page
  if(page !== 'favorites') return
  
  const user = currentUser()
  if(!user) {
    document.getElementById('favGrid').innerHTML = '<p class="stories">请先登录查看收藏</p>'
    return
  }
  
  const grid = document.getElementById('favGrid')
  const userData = getUserData(user.id)
  const favs = userData.favorites || []
  
  // 更新控制按钮显示状态
  const clearAllBtn = document.getElementById('clearAllBtn')
  const exportBtn = document.getElementById('exportBtn')
  if (clearAllBtn) clearAllBtn.style.display = favs.length > 0 ? 'inline-block' : 'none'
  if (exportBtn) exportBtn.style.display = favs.length > 0 ? 'inline-block' : 'none'
  
  if(favs.length === 0){ 
    grid.innerHTML = `
      <div class="empty-state">
        <h3>暂无收藏</h3>
        <p>快去收藏喜欢的目的地和套餐吧！</p>
        <a href="../destinations/destinations.html" class="btn btn-primary">浏览目的地</a>
      </div>
    `
    return 
  }
  
  grid.innerHTML = favs.map(item => `
    <article class="card favorite-card">
      <div class="media">${imageTag(item.cover, item.name || item.title)}</div>
      <div class="body">
        <h3 class="title">${item.name || item.title}</h3>
        <div class="meta">
          ${item.country ? `<span>${item.country}</span>` : ''}
          ${item.days ? `<span>${item.days}天</span>` : ''}
          ${item.price ? `<span>¥${item.price}</span>` : ''}
        </div>
        <div class="card-actions">
          <button onclick="viewDetails('${item.id}', '${item.type || 'destination'}')" class="btn btn-primary">查看详情</button>
          <button onclick="removeFavorite('${item.id}')" class="btn btn-outline">移除收藏</button>
        </div>
      </div>
    </article>
  `).join('')
}

function removeFavorite(itemId){
  const user = currentUser()
  if(!user) return
  
  const userData = getUserData(user.id)
  userData.favorites = userData.favorites.filter(f => f.id !== itemId)
  saveUserData(user.id, userData)
  renderFavorites()
  showToast('已移除收藏')
}

// 清空所有收藏
function clearAllFavorites(){
  if(!confirm('确定要清空所有收藏吗？此操作不可恢复。')) return
  
  const user = currentUser()
  if(!user) return
  
  const userData = getUserData(user.id)
  userData.favorites = []
  saveUserData(user.id, userData)
  renderFavorites()
  showToast('已清空所有收藏')
}

// 导出收藏数据
function exportFavorites(){
  const user = currentUser()
  if(!user) return
  
  const userData = getUserData(user.id)
  const favs = userData.favorites || []
  
  if(favs.length === 0) {
    showToast('暂无收藏数据可导出')
    return
  }
  
  const exportData = {
    exportTime: new Date().toISOString(),
    user: user.email || user.phone,
    favorites: favs
  }
  
  const dataStr = JSON.stringify(exportData, null, 2)
  const dataBlob = new Blob([dataStr], {type: 'application/json'})
  const url = URL.createObjectURL(dataBlob)
  
  const link = document.createElement('a')
  link.href = url
  link.download = `favorites_${new Date().toISOString().split('T')[0]}.json`
  link.click()
  
  URL.revokeObjectURL(url)
  showToast('收藏数据已导出')
}

// 查看详情
function viewDetails(itemId, type){
  if(type === 'destination') {
    window.location.href = `../destinations/destination.html?id=${itemId}`
  } else if(type === 'deal') {
    // 跳转到套餐详情或预订页面
    window.location.href = `book.html?id=${itemId}`
  }
}

// 更新收藏按钮状态
function updateFavoriteButton(itemId, isFavorited){
  const buttons = document.querySelectorAll(`[data-item-id="${itemId}"]`)
  buttons.forEach(button => {
    if(isFavorited) {
      button.classList.add('favorited')
      button.textContent = '已收藏'
    } else {
      button.classList.remove('favorited')
      button.textContent = '收藏'
    }
  })
}

// 检查收藏状态
function isFavorited(itemId){
  const user = currentUser()
  if(!user) return false
  
  const userData = getUserData(user.id)
  return userData.favorites.some(f => f.id === itemId)
}

// 重新实现的订单功能
function setupBooking(){
  const page = document.body.dataset.page
  if(page === 'book'){
    const params = new URLSearchParams(location.search)
    const pid = params.get('id') || '-'
    const name = params.get('name') || '-'
    const user = currentUser()
    if(!user){ 
      sessionStorage.setItem('back_url', location.href)
      location.href = 'travel_site/pages/login.html'
      return 
    }
    
    document.getElementById('bookTarget').textContent = `产品：${name} (#${pid})`
    const form = document.getElementById('bookForm')
    const msg = document.getElementById('bookMsg')
    
    form.addEventListener('submit', e => {
      e.preventDefault()
      const user = currentUser()
      if(!user){ 
        msg.textContent = '请先登录'
        msg.style.color = '#ff8080'
        return 
      }
      
      const order = {
        id: 'O' + Date.now(),
        pid,
        name,
        date: document.getElementById('bkDate').value,
        traveler: document.getElementById('bkName').value,
        phone: document.getElementById('bkPhone').value,
        status: '待支付',
        createTime: new Date().toISOString(),
        price: Math.floor(Math.random() * 5000) + 1000 // 模拟价格
      }
      
      // 保存到用户数据中
      const userData = getUserData(user.id)
      userData.orders = userData.orders || []
      userData.orders.push(order)
      saveUserData(user.id, userData)
      
      msg.textContent = '订单已创建，跳转到订单列表...'
      msg.style.color = 'var(--accent)'
      setTimeout(()=> location.href = 'travel_site/pages/orders.html', 1500)
    })
  }
  
  if(page === 'orders'){
    const user = currentUser()
    if(!user){ 
      sessionStorage.setItem('back_url', location.href)
      location.href = 'travel_site/pages/login.html'
      return 
    }
    
    renderOrders()
  }
}

function renderOrders(){
  const user = currentUser()
  if(!user) return
  
  const list = document.querySelector('#orderList')
  if (!list) return
  
  const userData = getUserData(user.id)
  const orders = userData.orders || []
  
  // 清空现有内容
  list.innerHTML = ''
  
  if(orders.length === 0){ 
    const emptyMsg = document.createElement('p')
    emptyMsg.className = 'stories'
    emptyMsg.innerText = '暂无订单，快去预订心仪的行程吧！'
    list.appendChild(emptyMsg)
    return 
  }
  
  // 按创建时间倒序排列
  const sortedOrders = orders.sort((a, b) => new Date(b.createTime) - new Date(a.createTime))
  
  // 使用DOM API创建订单列表
  sortedOrders.forEach(order => {
    const orderDiv = document.createElement('div')
    orderDiv.className = 'story'
    orderDiv.setAttribute('data-order-id', order.id)
    
    // 订单头部
    const header = document.createElement('div')
    header.className = 'order-header'
    
    const title = document.createElement('strong')
    title.innerText = order.name
    
    const status = document.createElement('span')
    status.className = `order-status status-${order.status === '待支付' ? 'pending' : 'paid'}`
    status.innerText = order.status
    
    header.appendChild(title)
    header.appendChild(status)
    
    // 订单信息
    const travelerInfo = document.createElement('p')
    travelerInfo.innerText = `出行人：${order.traveler} · 日期：${order.date}`
    
    const orderInfo = document.createElement('p')
    orderInfo.innerText = `订单号：${order.id} · 价格：¥${order.price}`
    
    const timeInfo = document.createElement('p')
    timeInfo.innerText = `创建时间：${new Date(order.createTime).toLocaleString()}`
    
    // 操作按钮
    const actions = document.createElement('div')
    actions.className = 'order-actions'
    
    if (order.status === '待支付') {
      const payBtn = document.createElement('button')
      payBtn.className = 'pay-btn'
      payBtn.innerText = '立即支付'
      payBtn.addEventListener('click', () => payOrder(order.id))
      actions.appendChild(payBtn)
    }
    
    const cancelBtn = document.createElement('button')
    cancelBtn.className = 'cancel-btn'
    cancelBtn.innerText = '取消订单'
    cancelBtn.addEventListener('click', () => cancelOrder(order.id))
    actions.appendChild(cancelBtn)
    
    // 组装订单元素
    orderDiv.appendChild(header)
    orderDiv.appendChild(travelerInfo)
    orderDiv.appendChild(orderInfo)
    orderDiv.appendChild(timeInfo)
    orderDiv.appendChild(actions)
    
    list.appendChild(orderDiv)
  })
}

function payOrder(orderId){
  const user = currentUser()
  if(!user) return
  
  const userData = getUserData(user.id)
  const order = userData.orders.find(o => o.id === orderId)
  if(order) {
    order.status = '已支付'
    order.payTime = new Date().toISOString()
    saveUserData(user.id, userData)
    renderOrders()
    showToast('支付成功！')
  }
}

function cancelOrder(orderId){
  if(confirm('确定要取消这个订单吗？')) {
    const user = currentUser()
    if(!user) return
    
    const userData = getUserData(user.id)
    userData.orders = userData.orders.filter(o => o.id !== orderId)
    saveUserData(user.id, userData)
    renderOrders()
    showToast('订单已取消')
  }
}

// 故事评论/发布（简化）
function setupStories(){
  const page = document.body.dataset.page
  if(page !== 'stories') return
  const listEl = document.getElementById('storyList')
  const stories = storage.get('xt_stories', [
    { id: 's1', title: '在清迈遇见慢生活', content: '古城墙骑行，夜市烟火升腾。' },
    { id: 's2', title: '冰岛环岛的七日', content: '冰川黑沙滩与极光。' }
  ])
  const render = () => {
    listEl.innerHTML = stories.map(s => `<article class="story"><h3>${s.title}</h3><p>${s.content}</p></article>`).join('')
  }
  render()

  const form = document.getElementById('storyForm')
  const title = document.getElementById('storyTitle')
  const content = document.getElementById('storyContent')
  const msg = document.getElementById('storyMsg')
  form.addEventListener('submit', e => {
    e.preventDefault()
    if(!title.value || !content.value){ msg.textContent = '请填写标题与内容'; return }
    stories.unshift({ id: 's' + Date.now(), title: title.value, content: content.value })
    storage.set('xt_stories', stories)
    title.value = content.value = ''
    msg.textContent = '发布成功'
    render()
  })
}

// 目的地详情页面设置
function setupDestinationDetail(){
  const params = new URLSearchParams(location.search)
  const destinationId = params.get('id')
  const destinationName = params.get('name') || '目的地'
  
  const container = document.getElementById('detailContainer')
  if(!container) return
  
  // 查找目的地信息
  const destination = destinations.find(d => d.id == destinationId)
  if(!destination) {
    container.innerHTML = '<p>目的地信息未找到</p>'
    return
  }
  
  // 构建页面内容
  let content = `
    <div class="destination-detail">
      <div class="destination-header">
        <h1>${destination.name}</h1>
        <p>探索${destination.name}的精彩体验，发现美食、购物和旅行故事</p>
      </div>
      <img src="${getAssetPath(destination.cover)}" alt="${destination.name}" class="destination-image" loading="lazy">
  `
  
  // 如果是巴厘岛，添加特色卡片
  if(destination.name === '巴厘岛') {
    content += `
      <div class="bali-cards-container">
        <div class="bali-card bali-food-card" onclick="window.location.href='../guides/bali-food-guide.html'">
          <div class="card-content">
            <span class="default-text">美食</span>
            <span class="hover-text">
              巴厘岛美食以香料丰富著称，如烤猪肉（Babi Guling）和椰子汤（Lawar）。海鲜和米饭是主食，深受当地文化影响。
              <a href="../guides/bali-food-guide.html" target="_blank">查看详细介绍</a>
            </span>
          </div>
        </div>
        
        <div class="bali-card bali-shopping-card" onclick="window.location.href='../guides/bali-shopping-guide.html'">
          <div class="card-content">
            <span class="default-text">购物</span>
            <span class="hover-text">
              巴厘岛购物以手工艺品和当地市场著称，如乌布艺术市场的手工银饰和蜡染纺织品，Beachwalk商场提供现代购物体验。
              <a href="../guides/bali-shopping-guide.html" target="_blank">查看详细推荐</a>
            </span>
          </div>
        </div>
        
        <div class="bali-card bali-travel-card" onclick="window.location.href='../guides/bali-travel-reviews.html'">
          <div class="card-content">
            <span class="default-text">游记</span>
            <span class="hover-text">
              探索巴厘岛的经典景点，了解游客的真实评价。包括海神庙、乌布猴林等热门地标。
              <a href="../guides/bali-travel-reviews.html" target="_blank">查看游客评价</a>
            </span>
          </div>
        </div>
      </div>
    `
  }
  
  // 如果是成都，添加特色卡片
  if(destination.name === '成都') {
    content += `
      <div class="bali-cards-container">
        <div class="bali-card chengdu-food-card" onclick="window.location.href='../guides/chengdu-food-guide.html'">
          <div class="card-content">
            <span class="default-text">美食</span>
            <span class="hover-text">
              成都作为"天府之国"的美食之都，以麻辣鲜香著称。火锅、麻婆豆腐、担担面等经典川菜让人回味无穷。
              <a href="../guides/chengdu-food-guide.html" target="_blank">查看详细介绍</a>
            </span>
          </div>
        </div>
        
        <div class="bali-card chengdu-shopping-card" onclick="window.location.href='../guides/chengdu-shopping-guide.html'">
          <div class="card-content">
            <span class="default-text">购物</span>
            <span class="hover-text">
              成都购物融合传统与现代，从春熙路商业街到宽窄巷子，从川菜调料到熊猫周边，应有尽有。
              <a href="../guides/chengdu-shopping-guide.html" target="_blank">查看详细推荐</a>
            </span>
          </div>
        </div>
        
        <div class="bali-card chengdu-video-card" onclick="window.location.href='../guides/chengdu-travel-videos.html'">
          <div class="card-content">
            <span class="default-text">视频</span>
            <span class="hover-text">
              通过官方旅游短视频，感受成都的独特魅力。从城市宣传到美食文化，从大熊猫基地到传统文化。
              <a href="../guides/chengdu-travel-videos.html" target="_blank">观看旅游视频</a>
            </span>
          </div>
        </div>
      </div>
    `
  }
  
  content += `
      <div class="section-header">
        <h2>关于${destination.name}</h2>
        <p>${destination.country} · 建议游玩${destination.days}天</p>
      </div>
      <div class="stories">
        <p>${destination.name}是一个充满魅力的目的地，拥有丰富的文化底蕴和自然风光。无论是美食探索、购物体验还是文化之旅，都能为您带来难忘的回忆。</p>
        <p>建议您提前规划行程，体验当地特色，感受不同文化的魅力。</p>
      </div>
    </div>
  `
  
  container.innerHTML = content
  
  // 添加滚动浮现动画
  setupBaliCardsAnimation()
}

// 巴厘岛卡片滚动动画设置
function setupBaliCardsAnimation(){
  const cards = document.querySelectorAll('.bali-card')
  if(cards.length === 0) return
  
  // 创建Intersection Observer来监听卡片进入视口
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
      if(entry.isIntersecting) {
        // 延迟添加动画类，实现依次浮现效果
        setTimeout(() => {
          entry.target.classList.add('animate-in')
        }, index * 200) // 每个卡片延迟200ms
      }
    })
  }, {
    threshold: 0.1, // 当卡片10%进入视口时触发
    rootMargin: '0px 0px -50px 0px' // 提前50px触发
  })
  
  // 观察所有卡片
  cards.forEach(card => {
    observer.observe(card)
  })
}

// 登录状态检查函数
function checkLoginStatus(targetUrl) {
  if (!isLoggedIn()) {
    alert('请先登录后再访问此页面')
    sessionStorage.setItem('back_url', targetUrl)
    // 根据当前页面位置决定跳转路径
    const isInSubDir = window.location.pathname.includes('/pages/') || window.location.pathname.includes('/destinations/')
    location.href = isInSubDir ? 'login.html' : 'travel_site/pages/login.html'
    return false
  }
  return true
}

// 在目的地/套餐列表绑定收藏与预订入口
function enhanceListingInteractions(){
  const page = document.body.dataset.page
  if(page === 'destinations' || page === undefined){
    const grid = document.getElementById('destinationGrid')
    if(grid){
      grid.addEventListener('click', e => {
        const card = e.target.closest('.card')
        if(!card) return
      })
    }
  }
  if(page === 'deals'){
    const grid = document.getElementById('dealGrid')
    if(grid){
      grid.addEventListener('click', e => {
        const btn = e.target.closest('a')
        if(btn && btn.textContent.includes('预订')){
          e.preventDefault()
          if (!checkLoginStatus(location.href)) return
          const card = btn.closest('.card')
          const title = card.querySelector('.title').textContent
          location.href = `travel_site/pages/book.html?name=${encodeURIComponent(title)}`
        }
      })
    }
  }
}

// 为导航链接添加登录检查
function setupNavigationAuthCheck() {
  // 需要登录才能访问的页面
  const protectedPages = ['favorites', 'orders', 'profile', 'book']
  
  document.querySelectorAll('a[href]').forEach(link => {
    const href = link.getAttribute('href')
    const isProtected = protectedPages.some(page => href.includes(page))
    
    if (isProtected) {
      link.addEventListener('click', (e) => {
        if (!checkLoginStatus(href)) {
          e.preventDefault()
        }
      })
    }
  })
}

// 初始化
document.addEventListener('DOMContentLoaded', () => {
  console.log('主初始化函数被调用');
  const page = document.body.dataset.page
  console.log('当前页面类型:', page);
  if(page === 'deals'){ 
    console.log('检测到deals页面，调用renderDeals');
    renderDeals() 
  }
  else if(page === 'destinations'){
    // 支持 ?q= 预过滤
    const params = new URLSearchParams(location.search)
    const q = (params.get('q') || '').toLowerCase()
    if(q){
      const filtered = destinations.filter(d => d.name.toLowerCase().includes(q) || d.country.toLowerCase().includes(q))
      renderDestinations(filtered)
      const input = document.getElementById('keyword'); if(input) input.value = params.get('q')
      const hint = document.getElementById('searchHint'); if(hint) hint.textContent = `为您找到 ${filtered.length} 个结果`
    } else {
      renderDestinations(destinations)
    }
    setupSearch()
  }
  else if(page === 'favorites'){ renderFavorites() }
  else if(page === 'orders'){ /* orders handled below */ }
  else if(page === 'destination-detail'){ 
    setupDestinationDetail()
  }
  else { // 首页
    renderDestinations(destinations)
    renderDeals()
    setupSearch()
    setupHotwords()
    setupSubscribe()
  }

  setupNav()
  setupSmoothScroll()
  setupHeroSlideshow()
  setupAuthPages()
  setupStories()
  setupBooking()
  enhanceListingInteractions()
  setupNavigationAuthCheck()
  updateAuthLink()
  setupI18n()
  setYear()
})


// ==================== 国际化功能 ====================
// 简单多语言实现 - 支持中英文切换
function setupI18n(){
  const select = document.getElementById('langSelect')  // 获取语言选择下拉框
  const saved = storage.get('xt_lang', 'zh-CN')  // 从本地存储获取保存的语言设置，默认为中文
  document.documentElement.lang = saved  // 设置HTML文档语言属性
  if(select){ select.value = saved }  // 设置下拉框当前值
  
  // 翻译词典对象
  const dict = {
    'zh-CN': {
      'nav.destinations': '目的地',
      'nav.deals': '特惠套餐',
      'nav.stories': '旅行故事',
      'nav.contact': '联系我们',
      'nav.login': '登录',
      'hero.title': '探索世界，从此刻启程',
      'hero.subtitle': '发现城市与自然的灵感目的地，享受无忧旅程。',
      'search.button': '搜索',
      'home.destinations.title': '热门目的地',
      'home.destinations.subtitle': '用镜头记录世界的颜色，用脚步丈量风景的温度。',
      'home.deals.title': '特惠套餐',
      'home.deals.subtitle': '机酒自由配，轻松省更多。',
      'home.stories.title': '旅行故事',
      'home.stories.subtitle': '一千个人有一千个远方，分享你的足迹。',
      'footer.about.title': '关于我们',
      'footer.about.desc': '心途旅行专注于高品质旅行体验与个性化路线定制。',
      'footer.contact.title': '联系信息',
      'footer.contact.phone': '客服热线：400-888-0000',
      'footer.contact.email': '邮箱：support@xintutravel.com',
      'footer.contact.hours': '工作时间：周一至周日 9:00-21:00',
      'footer.subscribe.title': '订阅资讯',
      'footer.subscribe.emailLabel': '邮箱',
      'footer.subscribe.placeholder': '输入邮箱，获取特价与攻略',
      'footer.subscribe.button': '订阅',
      'footer.copy.brand': '心途旅行',
      'footer.copy.rights': '保留所有权利'
    },
    'en': {
      'nav.destinations': 'Destinations',
      'nav.deals': 'Deals',
      'nav.stories': 'Stories',
      'nav.contact': 'Contact',
      'nav.login': 'Login',
      'hero.title': 'Explore the world, start now',
      'hero.subtitle': 'Find inspiring cities and nature, enjoy a worry-free journey.',
      'search.button': 'Search',
      'home.destinations.title': 'Popular Destinations',
      'home.destinations.subtitle': 'Capture colors with lens, measure warmth with steps.',
      'home.deals.title': 'Hot Deals',
      'home.deals.subtitle': 'Flight + Hotel bundles, save more with ease.',
      'home.stories.title': 'Travel Stories',
      'home.stories.subtitle': 'A thousand people, a thousand journeys. Share yours.',
      'footer.about.title': 'About Us',
      'footer.about.desc': 'We focus on high-quality trips and custom itineraries.',
      'footer.contact.title': 'Contact Info',
      'footer.contact.phone': 'Support: 400-888-0000',
      'footer.contact.email': 'Email: support@xintutravel.com',
      'footer.contact.hours': 'Hours: Mon-Sun 9:00-21:00',
      'footer.subscribe.title': 'Subscribe',
      'footer.subscribe.emailLabel': 'Email',
      'footer.subscribe.placeholder': 'Enter email to get deals and guides',
      'footer.subscribe.button': 'Subscribe',
      'footer.copy.brand': 'Xintu Travel',
      'footer.copy.rights': 'All rights reserved.'
    }
  }
  // 应用语言翻译
  const apply = (lang) => {
    const t = dict[lang]  // 获取指定语言的翻译对象
    if(!t) return  // 如果翻译不存在则返回
    
    // 处理所有带有data-i18n属性的元素
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n')  // 获取翻译键
      if(t[key]){ el.textContent = t[key] }  // 设置元素文本内容
    })
    
    // 处理所有带有data-i18n-placeholder属性的元素
    document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
      const key = el.getAttribute('data-i18n-placeholder')  // 获取翻译键
      if(t[key]) el.setAttribute('placeholder', t[key])  // 设置placeholder属性
    })
    
    // 单独处理首页标题/按钮（特殊元素）
    const h1 = document.querySelector('.hero-content h1'); if(h1 && t['hero.title']) h1.textContent = t['hero.title']
    const p = document.querySelector('.hero-content p'); if(p && t['hero.subtitle']) p.textContent = t['hero.subtitle']
    const btn = document.querySelector('#searchForm button'); if(btn && t['search.button']) btn.textContent = t['search.button']
    document.documentElement.lang = lang  // 设置HTML文档语言属性
  }
  
  apply(saved)  // 应用保存的语言设置
  
  // 监听语言选择变化
  if(select){
    select.addEventListener('change', () => {
      const lang = select.value  // 获取选择的语言
      storage.set('xt_lang', lang)  // 保存语言设置到本地存储
      apply(lang)  // 应用新的语言设置
    })
  }
}

