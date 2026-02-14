const gifStages = [
    "https://media1.giphy.com/media/v1.Y2lkPTc5MGI3NjExNG5sbW42bnNmbzVsd3B5NWM4NGJveGczNXY3YTFlcXJiaGFrNDhjYSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/fJfHptKXTnLM3VVSUS/giphy.gif",    // 0 normal
    "https://media3.giphy.com/media/v1.Y2lkPTc5MGI3NjExeHd1ZmVzejc5Ym5xY3QyaGNwcWJoYmVrdWIxb3E2MmFiMmxheTV6dCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/KhADkQ40Z6cfieGKxM/giphy.gif",  // 1 confused
    "https://media1.giphy.com/media/v1.Y2lkPTc5MGI3NjExNzZlbWtjdjJpNHFnN3RjMGE2NTZmbzU0cjY4Nm13ODg3ODUycjQ4eiZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/asbP3eIpTXlxS/giphy.gif",             // 2 pleading
    "https://media2.giphy.com/media/v1.Y2lkPTc5MGI3NjExdG04d3F4MXZ0NjU3Z3IzY3hzZWttaG9tdHoxZXlqc2xvNGRudjE2ZCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/hQ0GvkpZwYcgM/giphy.gif",             // 3 sad
    "https://media0.giphy.com/media/v1.Y2lkPTc5MGI3NjExMW54ZDMyenA5NDlzdzZ1aHM3eXUwOXVqdXA4anhvdmY0NnZpN3pwbCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/5JIak2EFfemQqQaJWK/giphy.gif",       // 4 sadder
    "https://tenor.com/nGNaTVZwd1T.gif",             // 5 devastated
    "https://tenor.com/sXUN.gif",               // 6 very devastated
    "https://tenor.com/bxcyv.gif"  // 7 crying runaway
]

const noMessages = [
    "No",
    "Are you positive? 🤔",
    "I don't believe it... 🥺",
    "If you say no, I will be really sad...",
    "I will be very sad... 😢",
    "Come On.... 💔",
    "Don't do this to me...",
    "Last chance! 😭",
    "You can't catch me anyway 😜"
]

const yesTeasePokes = [
    "try saying no first... I bet you want to know what happens 😏",
    "go on, hit no... just once 👀",
    "you're missing out 😈",
    "click no, I dare you 😏"
]

let yesTeasedCount = 0

let noClickCount = 0
let runawayEnabled = false
let musicPlaying = true

const catGif = document.getElementById('cat-gif')
const yesBtn = document.getElementById('yes-btn')
const noBtn = document.getElementById('no-btn')
const music = document.getElementById('bg-music')

// Autoplay: audio starts muted (bypasses browser policy), unmute immediately
music.muted = true
music.volume = 0.3
music.play().then(() => {
    music.muted = false
}).catch(() => {
    // Fallback: unmute on first interaction
    document.addEventListener('click', () => {
        music.muted = false
        music.play().catch(() => {})
    }, { once: true })
})

function toggleMusic() {
    if (musicPlaying) {
        music.pause()
        musicPlaying = false
        document.getElementById('music-toggle').textContent = '🔇'
    } else {
        music.muted = false
        music.play()
        musicPlaying = true
        document.getElementById('music-toggle').textContent = '🔊'
    }
}

function handleYesClick() {
    if (!runawayEnabled) {
        // Tease her to try No first
        const msg = yesTeasePokes[Math.min(yesTeasedCount, yesTeasePokes.length - 1)]
        yesTeasedCount++
        showTeaseMessage(msg)
        return
    }
    window.location.href = 'yes.html'
}

function showTeaseMessage(msg) {
    let toast = document.getElementById('tease-toast')
    toast.textContent = msg
    toast.classList.add('show')
    clearTimeout(toast._timer)
    toast._timer = setTimeout(() => toast.classList.remove('show'), 2500)
}

function handleNoClick() {
    noClickCount++

    // Cycle through guilt-trip messages
    const msgIndex = Math.min(noClickCount, noMessages.length - 1)
    noBtn.textContent = noMessages[msgIndex]

    // Grow the Yes button bigger each time
    const currentSize = parseFloat(window.getComputedStyle(yesBtn).fontSize)
    yesBtn.style.fontSize = `${currentSize * 1.35}px`
    const padY = Math.min(18 + noClickCount * 5, 60)
    const padX = Math.min(45 + noClickCount * 10, 120)
    yesBtn.style.padding = `${padY}px ${padX}px`

    // Shrink No button to contrast
    if (noClickCount >= 2) {
        const noSize = parseFloat(window.getComputedStyle(noBtn).fontSize)
        noBtn.style.fontSize = `${Math.max(noSize * 0.85, 10)}px`
    }

    // Swap cat GIF through stages
    const gifIndex = Math.min(noClickCount, gifStages.length - 1)
    swapGif(gifStages[gifIndex])

    // Runaway starts at click 5
    if (noClickCount >= 5 && !runawayEnabled) {
        enableRunaway()
        runawayEnabled = true
    }
}

function swapGif(src) {
    catGif.style.opacity = '0'
    setTimeout(() => {
        catGif.src = src
        catGif.style.opacity = '1'
    }, 200)
}

function enableRunaway() {
    noBtn.addEventListener('mouseover', runAway)
    noBtn.addEventListener('touchstart', runAway, { passive: true })
}

function runAway() {
    const margin = 20
    const btnW = noBtn.offsetWidth
    const btnH = noBtn.offsetHeight
    const maxX = window.innerWidth - btnW - margin
    const maxY = window.innerHeight - btnH - margin

    const randomX = Math.random() * maxX + margin / 2
    const randomY = Math.random() * maxY + margin / 2

    noBtn.style.position = 'fixed'
    noBtn.style.left = `${randomX}px`
    noBtn.style.top = `${randomY}px`
    noBtn.style.zIndex = '50'
}
