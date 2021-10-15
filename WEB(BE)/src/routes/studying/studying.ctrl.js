const { User } = require('../../models/User');
const { Group } = require('../../models/Group');

function seoul() {
  const temp = new Date();
  temp.setHours(temp.getHours() + 9);
  return temp;
}

const output = {
  // 타이머 일시정지
  pause: (req, res) => {
    const now = seoul();
    if (req.user.pauseTime)
      return res
        .status(200)
        .json({ isSuccessful: false, message: '이미 쉬는 중 입니다!' });
    if (!req.user.startTime)
      return res
        .status(200)
        .json({ isSuccessful: false, isStudyingNow: false });

    User.findOneAndUpdate(
      { userName: req.user.userName },
      { $set: { pauseTime: now } },
      err => {
        if (err) {
          return res.status(500).json({ isSuccessful: false, err });
        }
        return res.status(200).json({
          isSuccessful: true,
          elapsedTime: Math.floor((seoul() - req.user.startTime) / 1000),
          isStudyingNow: true,
        });
      },
    );
  },

  // 타이머 재개
  resume: (req, res) => {
    let now = seoul();
    if (!req.user.pauseTime)
      return res
        .status(200)
        .json({ isSuccessful: false, message: '일시정지 상태가 아닙니다.' });
    now = now - req.user.pauseTime + req.user.startTime.valueOf();
    User.findOneAndUpdate(
      { userName: req.user.userName },
      { $set: { pauseTime: null, startTime: now } },
      err => {
        if (err) {
          return res.status(500).json({ isSuccessful: false, err });
        }
        return res.status(200).json({
          isSuccessful: true,
          elapsedTime: Math.floor((seoul() - now) / 1000),
          isStudyingNow: true,
        });
      },
    );
  },

  // 타이머 경과 시간
  status: (req, res) => {
    const now = seoul();
    if (!req.user.startTime)
      return res
        .status(200)
        .json({ isSuccessful: false, isStudyingNow: false });
    if (req.user.pauseTime) {
      return res.status(200).json({
        isSuccessful: true,
        elapsedTime: Math.floor(
          (req.user.pauseTime - req.user.startTime) / 1000,
        ),
        isStudyingNow: true,
        isPaused: true,
        activeGroup: req.user.activeGroup,
      });
    }
    return res.status(200).json({
      isSuccessful: true,
      elapsedTime: Math.floor((now - req.user.startTime) / 1000),
      isStudyingNow: true,
      isPaused: false,
      activeGroup: req.user.activeGroup,
    });
  },

  // 타이머 종료
  end: async (req, res) => {
    let now = await seoul();
    if (!req.user.startTime)
      return res
        .status(200)
        .json({ isSuccessful: false, message: '공부를 시작해주세요.' });
    if (req.user.pauseTime)
      req.user.startTime =
        now - req.user.pauseTime + req.user.startTime.valueOf();
    now = await Math.floor((now - req.user.startTime) / 1000);
    try {
      if (req.user.activeGroup !== null) {
        Group.findOne(
          { groupName: req.user.activeGroup },
          async (err, group) => {
            try {
              await Group.findOneAndUpdate(
                { groupName: req.user.activeGroup },
                {
                  $set: {
                    totalTime: group.totalTime + now,
                  },
                },
              );
            } catch (err) {
              res.status(500).json(err);
            }
          },
        );
      }
      const today = seoul();
      const year = today.getFullYear();
      const month = `0${today.getMonth() + 1}`.slice(-2);
      const day = `0${today.getDate()}`.slice(-2);
      const dateString = `${year}-${month}-${day}`;

      const USER = await User.findById(req.user._id);
      const array = await [{ day: dateString }].concat(USER.history);

      const result = await Array.from(
        new Map(array.map(elem => [elem.day.toString(), elem])).values(),
      );

      USER.history = await result;

      await USER.history.map(async his => {
        if (his.day === dateString) {
          if (his.value === undefined) his.value = 0;
          his.value += await now;
        }
      });

      USER.startTime = null;
      USER.totalTime += now;
      USER.pauseTime = null;
      USER.activeGroup = null;

      const temp = await USER.history.sort((a, b) => {
        const x = a.day;
        const y = b.day;
        if (x < y) {
          return 1;
        }
        if (x > y) {
          return -1;
        }
        return 0;
      });

      // 스트릭 구하기
      let streak = 1;
      let yesterday = new Date(
        new Date(year, month - 1, day).setDate(
          new Date(year, month - 1, day).getDate() - 1,
        ),
      );
      // yesterday에 어제의 값을 넣고 다음 배열과 같으면 ++ 다르면 break
      for (let i = 1; i < USER.history.length; i++) {
        const year2 = USER.history[i].day.substring(0, 4);
        const month2 = USER.history[i].day.substring(5, 7);
        const day2 = USER.history[i].day.substring(8, 10);
        if (String(yesterday) === String(new Date(year2, month2 - 1, day2)))
          streak += 1;
        else break;
        yesterday = new Date(
          new Date(year2, month2 - 1, day2).setDate(
            new Date(year2, month2 - 1, day2).getDate() - 1,
          ),
        );
      }
      // 스트릭 db에 저장
      USER.curStreak = streak;
      if (USER.maxStreak < streak) USER.maxStreak = streak;
      const final = await new User(USER);
      await final.save(err => {
        return res.status(200).json({
          isSuccessful: true,
          elapsedTime: now,
          activeGroup: req.user.activeGroup,
        });
      });
    } catch (err) {
      return res.status(500).json({ isSuccessful: false, err });
    }
  },
};

const process = {
  // 타이머 시작
  start: async (req, res) => {
    if (req.user.startTime)
      return res.status(200).json({
        isSuccessful: false,
        message: '이미 공부 중 입니다.',
      });
    if (req.body.groupName === undefined) req.body.groupName = null;

    const now = seoul();

    try {
      await User.findOneAndUpdate(
        { userName: req.user.userName },
        {
          $set: {
            startTime: now,
            activeGroup: req.body.groupName,
          },
        },
      );
      return res.status(200).json({
        isSuccessful: true,
        elapsedTime: 0,
        isStudyingNow: true,
        activeGroup: req.body.groupName,
      });
    } catch (err) {
      return res.status(500).json({ isSuccessful: false, err });
    }
  },
};

module.exports = {
  output,
  process,
};