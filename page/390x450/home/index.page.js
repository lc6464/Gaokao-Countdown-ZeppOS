import { TITLE, TIME, TITLE_YEAR, TIME_LINE1, TIME_LINE2 } from './index.style';
import Timer from "../../../utils/timer"
import {SmoothTimer, createSmoothTimer, stopSmoothTimer} from "../../../utils/smoothTimer"
let hmTimer;
const logger = DeviceRuntimeCore.HmLogger.getLogger('GaoKaoCountdown');
Page({
	build() {
		logger.debug('page build invoked');

		const title_year = hmUI.createWidget(hmUI.widget.TEXT, {
			text: '加载中',
			...TITLE_YEAR
		});
		const title = hmUI.createWidget(hmUI.widget.TEXT, {
			text: '高考倒计时',
			...TITLE
		});
		const countdown_line1 = hmUI.createWidget(hmUI.widget.TEXT, {
			text: '加载中……',
			...TIME_LINE1
		});
		const countdown_line2 = hmUI.createWidget(hmUI.widget.TEXT, {
			text: '',
			...TIME_LINE2
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

		title_year.setProperty(hmUI.prop.TEXT, `${year}年`);
		if (isEnd) {
			countdown.setProperty(hmUI.prop.TEXT, endText);
		} else {
			const countdownTimer = new Timer(new Date(year, 5, 7, 9, 0, 0));
			hmTimer = createSmoothTimer(
				0,
				1000,
				function() {
					const { days, hours, minutes, seconds, isCountdown } = countdownTimer.timing();
					if (isCountdown) {
						countdown_line1.setProperty(hmUI.prop.TEXT, `${days}天 ${hours}时`);
						countdown_line2.setProperty(hmUI.prop.TEXT, `${minutes}分 ${seconds}秒`);
					} else {
						countdown_line1.setProperty(hmUI.prop.TEXT, '');
						countdown_line2.setProperty(hmUI.prop.TEXT, endText);
						stopSmoothTimer(hmTimer);
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