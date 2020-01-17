var skills
if (localStorage.getItem('skills')) {
    skills = JSON.parse(localStorage.getItem('skills'))
    console.log(skills)
} else {
    var skills = [{
        name: 'Meditation',
        startingStreakMultiplier: 2,
        streakAdditive: 0.05,
        lastTimelog: [1, 1, 2000],
        daysOnStreak: 0,
        xp: 0,
        conversionRate: 1,
        startingXP: 20
    }, {
        name: 'Japanese',
        startingStreakMultiplier: 1.25,
        streakAdditive: 0.015,
        lastTimelog: [1, 1, 2000],
        daysOnStreak: 0,
        xp: 0,
        conversionRate: 0.6,
        startingXP: 70
    }, {
        name: 'French',
        startingStreakMultiplier: 1.2,
        streakAdditive: 0.01,
        lastTimelog: [1, 1, 2000],
        daysOnStreak: 0,
        xp: 0,
        conversionRate: 0.4,
        startingXP: 60
    }, {
        name: 'Coding',
        startingStreakMultiplier: 1.4,
        streakAdditive: 0.02,
        lastTimelog: [1, 1, 2000],
        daysOnStreak: 0,
        xp: 0,
        conversionRate: 0.6,
        startingXP: 80
    }, {
        name: 'Study',
        startingStreakMultiplier: 1.35,
        streakAdditive: 0.015,
        lastTimelog: [1, 1, 2000],
        daysOnStreak: 0,
        xp: 0,
        conversionRate: 0.4,
        startingXP: 80
    }, {
        name: 'Work',
        startingStreakMultiplier: 1.5,
        streakAdditive: 0.01,
        lastTimelog: [1, 1, 2000],
        daysOnStreak: 0,
        xp: 0,
        conversionRate: 0.5,
        startingXP: 100
    }, {
        name: 'Working out',
        startingStreakMultiplier: 1.5,
        streakAdditive: 0.015,
        lastTimelog: [1, 1, 2000],
        daysOnStreak: 0,
        xp: 0,
        conversionRate: 0.75,
        startingXP: 40
    }, {
        name: 'Sleeping',
        startingStreakMultiplier: 1.5,
        streakAdditive: 0.02,
        lastTimelog: [1, 1, 2000],
        daysOnStreak: 0,
        xp: 0,
        conversionRate: 1,
        startingXP: 60
    }, {
        name: 'Chores',
        startingStreakMultiplier: 1.25,
        streakAdditive: 0.01,
        lastTimelog: [1, 1, 2000],
        daysOnStreak: 0,
        xp: 0,
        conversionRate: 0.25,
        startingXP: 30
    }, {
        name: 'Science',
        startingStreakMultiplier: 1.25,
        streakAdditive: 0.02,
        lastTimelog: [1, 1, 2000],
        daysOnStreak: 0,
        xp: 0,
        conversionRate: 0.35,
        startingXP: 30
    }, {
        name: 'Shadowing',
        startingStreakMultiplier: 1.5,
        streakAdditive: 0.025,
        lastTimelog: [1, 1, 2000],
        daysOnStreak: 0,
        xp: 0,
        conversionRate: 0.5,
        startingXP: 30
    }]
    localStorage.setItem('skills', JSON.stringify(skills))
}

function storeData() {
    localStorage.setItem('skills', JSON.stringify(skills));
}

function wasLastTimelogTodayOrYesterday(lastTimelog) {
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

    return [lastTimeT, lastTimeY]
}

// time logs = [monthIndex (January=0), date (day), year]
function calculateStreakMultiplier(startingStreakMultiplier, streakAdditive, daysOnStreak, lastTimelog) {
    var lastTimeTodayOrYesterday = wasLastTimelogTodayOrYesterday(lastTimelog)
    if(lastTimeTodayOrYesterday[1]) {
        return startingStreakMultiplier + (streakAdditive * (daysOnStreak - 1))
    } else if (lastTimeTodayOrYesterday[0]) {
        // If last time was today and daysOnStreak is 1, it means they didn't do it yesterday, so there's no streak multiplier
        if(daysOnStreak > 1) {
            return startingStreakMultiplier + (streakAdditive * (daysOnStreak - 2))
        }
    } // else
    return 1
}

function nextLevelXP(currentLevel, startingXP) {
    if (currentLevel < 10) {
        return Math.ceil(startingXP * (1 + (currentLevel * .25 - .25)))
    }
    return Math.ceil(startingXP * (currentLevel + 1))
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

function changeXP(newXP, skillName) {
    var lookingForSkill = true
    var index = 0
    while(lookingForSkill) {
        let s = skills[index];
        if(s.name == skillName) {
            lookingForSkill = false
            let streakMultiplier = calculateStreakMultiplier(s.startingStreakMultiplier, s.streakAdditive, s.daysOnStreak, s.lastTimelog);
            if(newXP < 0) {
                if(newXP*-1 > s.xp) {
                    s.xp = 0
                } else { 
                    s.xp += newXP
                }
            } else {
                s.xp += newXP * streakMultiplier
            }
            if(wasLastTimelogTodayOrYesterday(s.lastTimelog)[1] || !(wasLastTimelogTodayOrYesterday(s.lastTimelog)[0] || wasLastTimelogTodayOrYesterday(s.lastTimelog)[0])) {
                s.daysOnStreak++
            }
            let now = new Date()
            s.lastTimelog = [now.getMonth(), now.getDate(), now.getFullYear()]
        }
        index++
    }
    storeData()
}