import { TITLE, TIME } from './index.style';
import Timer from './timer';

let hmTimer;
const logger = DeviceRuntimeCore.HmLogger.getLogger('GaoKaoCountdown');
Page({
	build() {
		logger.debug('page build invoked');

		const title = hmUI.createWidget(hmUI.widget.TEXT, {
			text: '加载中',
			...TITLE
		});
		const countdown = hmUI.createWidget(hmUI.widget.TEXT, {
			text: '加载中……',
			...TIME
		});

		const now = new Date,
			endText = '高考已开始或已结束！';
		let isEnd = false,
			year;

		if (now.getMonth() === 5) { // 6月份
			if ((now.getDate() === 7 && now.getHours() > 9) || now.getDate() <= 9) { // 7号早上9点到9号
				year = now.getFullYear();
				isEnd = true;
			} else if (now.getDate() > 9) { // 九号之后
				year = now.getFullYear() + 1;
			} else { // 开考前
				year = now.getFullYear();
			}
		} else if (now.getMonth() < 5) { // 六月之前
			year = now.getFullYear();
		} else { // 六月之后
			year = now.getFullYear() + 1;
		}

		title.setProperty(hmUI.prop.TEXT, `${year}年高考倒计时`);
		if (isEnd) {
			countdown.setProperty(hmUI.prop.TEXT, endText);
		} else {
			const countdownTimer = new Timer(new Date(year, 5, 7, 9, 0, 0));
			hmTimer = timer.createTimer(
				0,
				1000,
				function() {
					const { days, hours, minutes, seconds, isCountdown } = countdownTimer.timing();
					if (isCountdown) {
						countdown.setProperty(hmUI.prop.TEXT, `${days}天${hours}时${minutes}分${seconds}秒`);
					} else {
						countdown.setProperty(hmUI.prop.TEXT, endText);
						timer.stopTimer(hmTimer);
					}
				}
			);
		}

	},
	onInit() {
		logger.debug('page onInit invoked');
	},

	onDestroy() {
		logger.debug('page onDestroy invoked');
		timer.stopTimer(hmTimer);
	},
});