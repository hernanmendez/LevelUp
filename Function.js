var skills
if (localStorage.getItem('skills')) {
    skills = JSON.parse(localStorage.getItem('skills'))
} else {
    var skills = [{
        name: '',
        startingStreakMultiplier: '',
        streakAdditive: 0.0,
        lastTimelog: [1, 1, 2000],
        daysOnStreak: 0,
        xp: 0,
        conversionRate: 0.0,
        startingXP: 0
    }, {
        name: '',
        startingStreakMultiplier: '',
        streakAdditive: 0.0,
        lastTimelog: [1, 1, 2000],
        daysOnStreak: 0,
        xp: 0,
        conversionRate: 0.0,
        startingXP: 0
    }, {
        name: '',
        startingStreakMultiplier: '',
        streakAdditive: 0.0,
        lastTimelog: [1, 1, 2000],
        daysOnStreak: 0,
        xp: 0,
        conversionRate: 0.0,
        startingXP: 0
    }, {
        name: '',
        startingStreakMultiplier: '',
        streakAdditive: 0.0,
        lastTimelog: [1, 1, 2000],
        daysOnStreak: 0,
        xp: 0,
        conversionRate: 0.0,
        startingXP: 0
    }, {
        name: '',
        startingStreakMultiplier: '',
        streakAdditive: 0.0,
        lastTimelog: [1, 1, 2000],
        daysOnStreak: 0,
        xp: 0,
        conversionRate: 0.0,
        startingXP: 0
    }, {
        name: '',
        startingStreakMultiplier: '',
        streakAdditive: 0.0,
        lastTimelog: [1, 1, 2000],
        daysOnStreak: 0,
        xp: 0,
        conversionRate: 0.0,
        startingXP: 0
    }, {
        name: '',
        startingStreakMultiplier: '',
        streakAdditive: 0.0,
        lastTimelog: [1, 1, 2000],
        daysOnStreak: 0,
        xp: 0,
        conversionRate: 0.0,
        startingXP: 0
    }, {
        name: '',
        startingStreakMultiplier: '',
        streakAdditive: 0.0,
        lastTimelog: [1, 1, 2000],
        daysOnStreak: 0,
        xp: 0,
        conversionRate: 0.0,
        startingXP: 0
    }, {
        name: '',
        startingStreakMultiplier: '',
        streakAdditive: 0.0,
        lastTimelog: [1, 1, 2000],
        daysOnStreak: 0,
        xp: 0,
        conversionRate: 0.0,
        startingXP: 0
    }, {
        name: '',
        startingStreakMultiplier: '',
        streakAdditive: 0.0,
        lastTimelog: [1, 1, 2000],
        daysOnStreak: 0,
        xp: 0,
        conversionRate: 0.0,
        startingXP: 0
    }, {
        name: '',
        startingStreakMultiplier: '',
        streakAdditive: 0.0,
        lastTimelog: [1, 1, 2000],
        daysOnStreak: 0,
        xp: 0,
        conversionRate: 0.0,
        startingXP: 0
    }]
}

function storeData() {
    localStorage.setItem('skills', JSON.stringify(skills));
}

// time logs = [monthIndex (January=0), date (day), year]
function calculateStreakMultiplier(startingStreakMultiplier, streakAdditive, daysOnStreak, lastTimelog) {
    var now = new Date()
    // p = present | l = last
    var pDay = now.getDate()
    var pMonth = now.getMonth()
    var pYear = now.getFullYear()
    var lDay = lastTimelog[1]
    var lMonth = lastTimelog[0]
    var lYear = lastTimelog[2]

    // Was the last time yesterday or today?
    var lastTimeT = false
    var lastTimeY = false
    // If not then streak multiplier is 1 (no streak)

    // Was the last time today?
    if (pDay == lDay && pMonth == lMonth && pYear == lYear) {
        lastTimeT = true
    }

    // Was the last time yesterday?
    var lastTime = new Date(lYear, lMonth, lDay)
    var lastTimeplus1day = new Date(lastTime.getTime() + (1000 * 60 * 60 * 24));
    lDay = lastTimeplus1day.getDate()
    lMonth = lastTimeplus1day.getMonth()
    lYear = lastTimeplus1day.getFullYear()

    if (pDay == lDay && pMonth == lMonth && pYear == lYear) {
        lastTimeY = true
    }

    if(lastTimeY) {
        return startingStreakMultiplier + (streakAdditive * (daysOnStreak - 1))
    } else if (lastTimeT) {
        // If last time was today and daysOnStreak is 1, it means they didn't do it yesterday, so there's no streak multiplier
        if(daysOnStreak > 1) {
            return startingStreakMultiplier + (streakAdditive * (daysOnStreak - 2))
        }
    } // else
    return 1
}

function nextLevelXP(currentLevel, startingXP) {
    if (currentLevel < 10) {
        return startingXP * (1 + (currentLevel * .25 - .25))
    }
    return startingXP * (currentLevel + 1)
}

function getLevel(xp, startingXP) {
    var level = 0
    while(xp >= 0) {
        level++
        xp -= nextLevelXP(level, startingXP)
    }
    var remainingXP = xp + nextLevelXP(level, startingXP)
    return [level, remainingXP]
}

function addXP(newXP, skillName) {
    var lookingForSkill = true
    var index = 0
    while(lookingForSkill) {
        let s = skills[index];
        if(s.name == skillName) {
            lookingForSkill = false
            s.xp += newXP * calculateStreakMultiplier(s.startingStreakMultiplier, s.streakAdditive, s.daysOnStreak, s.lastTimelog)
            let now = new Date()
            s.lastTimelog = [now.getMonth(), now.getDate(), now.getFullYear()]
            s.daysOnStreak++
        }
        index++
    }
    storeData()
}