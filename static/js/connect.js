let account1 = '';
let account3 = '';
let account6 = '';
let info1 = '';
let info3 = '';
let info6 = '';
let web3;
let stakeContract1;
let stakeContract3;
let stakeContract6;
let tokenContract;

let approve1;
let approve3;
let approve6;

/***
 * start new...
 */

const Web3Modal = window.Web3Modal.default;
const walletConnectProvider = window.WalletConnectProvider.default;

let provider;
let web3Modal;

async function connectWalletMonth() {

	if (account1 == '') {

		const providerOptions = {
			walletconnect: {
				package: walletConnectProvider,
				options: {
					// Mikko's test key - don't copy as your mileage may vary
					infuraId: "8043bb2cf99347b1bfadfb233c5325c0",
					rpc: {
						56: "https://silent-white-bird.bsc.quiknode.pro/5f09f571c5be59165e413d35502393e979acf3e0/"
					},
					network: "binance"
				}
			},
			fortmatic: {
				package: Fortmatic,
				options: {
					// Mikko's TESTNET api key
					key: "pk_test_391E26A3B43A3350"
				}
			}
		};

		web3Modal = new Web3Modal({
			network: 'binance',
			cacheProvider: false, // optional
			providerOptions, // required
			disableInjectedProvider: false, // optional. For MetaMask / Brave / Opera.
		});

		provider = await web3Modal.connect();

		web3 = new Web3(provider);
		const chainId = await web3.eth.getChainId();
		const chainData = evmChains.getChain(chainId);
		const accounts = await web3.eth.getAccounts();
		selectedAccount = accounts[0];
		web3BaseUrl_main = 'https://silent-white-bird.bsc.quiknode.pro/5f09f571c5be59165e413d35502393e979acf3e0/';
		web3_main = new Web3(new Web3.providers.HttpProvider(web3BaseUrl_main));

		await initContract();

		try {
			provider.request({
				method: 'wallet_switchEthereumChain',
				params: [{ chainId: '0x38' }], // chainId must be in hexadecimal numbers
			});

		} catch (e) {
			console.log(`errr===>`, e.toString());
		}

		account1 = account3 = account6 = selectedAccount;

		$("#stakeconnectButtonMonth1").html(formatAddr(account1));
		info1 = await getInfoMonth1();
		$("#stakecountdownMonth1").css('display', 'block');
		$("#stakecountdownTimerMonth1").css('display', 'block');
		$("#userstakedAmountMonth1").css('display', 'block');
		let amount = info1.amount / (10 ** 9);
		// let reward = info.rewardDebt / (10 ** 9);
		$("#userstakedAmountMonth1").html(amount);

		let arr = localStorage.getItem('mndApprove1');
		let flag = false;
		if (arr != null && arr != 'null') {
			arr = arr.split(',');
			for (let i = 0; i < arr.length; i++) {
				if (arr[i] == account1) {
					flag = true;
				}
			}
		}

		if (flag == true) {
			$("#contributeButtonMonth1").css('display', 'block');
			$("#approveButtonMonth1").css('display', 'none');
		} else {
			$("#approveButtonMonth1").attr("disabled", false);
		}

		$("#stakeconnectButtonMonth3").html(formatAddr(account3));
		info3 = await getInfoMonth3();
		$("#stakecountdownMonth3").css('display', 'block');
		$("#stakecountdownTimerMonth3").css('display', 'block');
		$("#userstakedAmountMonth3").css('display', 'block');
		amount = info3.amount / (10 ** 9);
		// let reward = info.rewardDebt / (10 ** 9);
		$("#userstakedAmountMonth3").html(amount);

		arr = localStorage.getItem('mndApprove3');
		flag = false;
		if (arr != null && arr != 'null') {
			arr = arr.split(',');
			for (let i = 0; i < arr.length; i++) {
				if (arr[i] == account1) {
					flag = true;
				}
			}
		}

		if (flag == true) {
			$("#contributeButtonMonth3").css('display', 'block');
			$("#approveButtonMonth3").css('display', 'none');
		} else {
			$("#approveButtonMonth3").attr("disabled", false);
		}

		$("#stakeconnectButtonMonth6").html(formatAddr(account6));
		info6 = await getInfoMonth6();
		$("#stakecountdownMonth6").css('display', 'block');
		$("#stakecountdownTimerMonth6").css('display', 'block');
		$("#userstakedAmountMonth6").css('display', 'block');
		amount = info6.amount / (10 ** 9);
		// let reward = info.rewardDebt / (10 ** 9);
		$("#userstakedAmountMonth6").html(amount);

		arr = localStorage.getItem('mndApprove6');
		flag = false;
		if (arr != null && arr != 'null') {
			arr = arr.split(',');
			for (let i = 0; i < arr.length; i++) {
				if (arr[i] == account1) {
					flag = true;
				}
			}
		}
		if (flag == true) {
			$("#contributeButtonMonth6").css('display', 'block');
			$("#approveButtonMonth6").css('display', 'none');
		} else {
			$("#approveButtonMonth6").attr("disabled", false);
		}

		$(".dropdown").css('display', 'block');

		$("#connectButtonMonth1").css('display', 'none');
		$("#connectButtonMonth3").css('display', 'none');
		$("#connectButtonMonth6").css('display', 'none');
		localStorage.setItem('MndStakeAccount', account1);
	}
}

async function disconnect() {

	if (provider) {
		try {
			await provider.close();
		} catch (e) {
		}
		provider = null;
		await web3Modal.clearCachedProvider();
	}

	account1 = account3 = account6 = '';
	localStorage.setItem('MndStakeAccount', '');


	$("#connectButtonMonth6").css('display', 'block');
	$("#stakecountdownMonth6").css('display', 'none');
	$("#stakecountdownTimerMonth6").css('display', 'none');
	$("#userstakedAmountMonth6").css('display', 'none');
	$("#contributeButtonMonth6").attr("disabled", true);

	$("#connectButtonMonth1").css('display', 'block');
	$("#stakecountdownMonth1").css('display', 'none');
	$("#stakecountdownTimerMonth1").css('display', 'none');
	$("#userstakedAmountMonth1").css('display', 'none');
	$("#contributeButtonMonth1").attr("disabled", true);

	$("#connectButtonMonth3").css('display', 'block');
	$("#stakecountdownMonth3").css('display', 'none');
	$("#stakecountdownTimerMonth3").css('display', 'none');
	$("#userstakedAmountMonth3").css('display', 'none');
	$("#contributeButtonMonth3").attr("disabled", true);

	$(".dropdown").css('display', 'none');
}

function formatAddr(str) {
	let ret;
	ret = str.substring(0, 6) + '...' + str.substring(38, 42);
	return ret;
}

async function initContract() {
	stakeContract1 = new web3_main.eth.Contract(stakeAbi1, stakeAddr1);
	stakeContract6 = new web3_main.eth.Contract(stakeAbi1, stakeAddr6);
	stakeContract3 = new web3_main.eth.Contract(stakeAbi1, stakeAddr3);
	tokenContract = new web3_main.eth.Contract(MindMusicAbi, MindMusicAddr);
}

// async function initWalletConnect() {
// 	let account = localStorage.getItem('MndStakeAccount');
// 	if (account == null) {
// 		account = '';
// 	}
// 	if (account.length == 42 && account != '' && account.substring(0, 2) == '0x') {
// 		account1 = account3 = account6 = account;
// 		$("#stakeconnectButtonMonth1").html(formatAddr(account1));

// 		web3BaseUrl_main = 'https://silent-white-bird.bsc.quiknode.pro/5f09f571c5be59165e413d35502393e979acf3e0/';
// 		web3_main = new Web3(new Web3.providers.HttpProvider(web3BaseUrl_main));



// 		await initContract();

// 		info1 = await getInfoMonth1();
// 		$("#stakecountdownMonth1").css('display', 'block');
// 		$("#stakecountdownTimerMonth1").css('display', 'block');
// 		$("#userstakedAmountMonth1").css('display', 'block');
// 		let amount = info1.amount / (10 ** 9);
// 		// let reward = info.rewardDebt / (10 ** 9);
// 		$("#userstakedAmountMonth1").html(amount);

// 		let arr = localStorage.getItem('mndApprove1');
// 		let flag = false;
// 		if (arr != null && arr != 'null') {
// 			arr = arr.split(',');
// 			for (let i = 0; i < arr.length; i++) {
// 				if (arr[i] == account1) {
// 					flag = true;
// 				}
// 			}
// 		}

// 		if (flag == true) {
// 			$("#contributeButtonMonth1").css('display', 'block');
// 			$("#approveButtonMonth1").css('display', 'none');
// 		} else {
// 			$("#approveButtonMonth1").attr("disabled", false);
// 		}

// 		$("#stakeconnectButtonMonth3").html(formatAddr(account3));
// 		info3 = await getInfoMonth3();
// 		$("#stakecountdownMonth3").css('display', 'block');
// 		$("#stakecountdownTimerMonth3").css('display', 'block');
// 		$("#userstakedAmountMonth3").css('display', 'block');
// 		amount = info3.amount / (10 ** 9);
// 		// let reward = info.rewardDebt / (10 ** 9);
// 		$("#userstakedAmountMonth3").html(amount);

// 		arr = localStorage.getItem('mndApprove3');
// 		flag = false;
// 		if (arr != null && arr != 'null') {
// 			arr = arr.split(',');
// 			for (let i = 0; i < arr.length; i++) {
// 				if (arr[i] == account1) {
// 					flag = true;
// 				}
// 			}
// 		}

// 		if (flag == true) {
// 			$("#contributeButtonMonth3").css('display', 'block');
// 			$("#approveButtonMonth3").css('display', 'none');
// 		} else {
// 			$("#approveButtonMonth3").attr("disabled", false);
// 		}

// 		$("#stakeconnectButtonMonth6").html(formatAddr(account6));
// 		info6 = await getInfoMonth6();
// 		$("#stakecountdownMonth6").css('display', 'block');
// 		$("#stakecountdownTimerMonth6").css('display', 'block');
// 		$("#userstakedAmountMonth6").css('display', 'block');
// 		amount = info6.amount / (10 ** 9);
// 		// let reward = info.rewardDebt / (10 ** 9);
// 		$("#userstakedAmountMonth6").html(amount);

// 		arr = localStorage.getItem('mndApprove6');
// 		flag = false;
// 		if (arr != null && arr != 'null') {
// 			arr = arr.split(',');
// 			for (let i = 0; i < arr.length; i++) {
// 				if (arr[i] == account1) {
// 					flag = true;
// 				}
// 			}
// 		}
// 		if (flag == true) {
// 			$("#contributeButtonMonth6").css('display', 'block');
// 			$("#approveButtonMonth6").css('display', 'none');
// 		} else {
// 			$("#approveButtonMonth6").attr("disabled", false);
// 		}

// 	}
// }

async function approveMonth1() {
	tokenContract = new web3.eth.Contract(MindMusicAbi, MindMusicAddr);
	stakeContract1 = new web3.eth.Contract(stakeAbi1, stakeAddr1);
	await tokenContract.methods.approve(stakeAddr1, '0xffffffffffffffffffffff').send({
		from: account1
	});

	$("#contributeButtonMonth1").css('display', 'block');
	$("#approveButtonMonth1").css('display', 'none');

	let arr = localStorage.getItem('mndApprove1');
	let arr1;
	if (arr == null || arr == 'null') {
		arr1 = new Array();
		arr1.push(account1);
	} else {
		arr1 = arr.split(',');
		arr1.push(account1);
	}
	localStorage.setItem('mndApprove1', arr1);
}

async function approveMonth3() {
	tokenContract = new web3.eth.Contract(MindMusicAbi, MindMusicAddr);
	stakeContract3 = new web3.eth.Contract(stakeAbi1, stakeAddr3);
	await tokenContract.methods.approve(stakeAddr3, '0xffffffffffffffffffffff').send({
		from: account3
	});

	$("#contributeButtonMonth3").css('display', 'block');
	$("#approveButtonMonth3").css('display', 'none');

	let arr = localStorage.getItem('mndApprove3');
	let arr1;
	if (arr == null || arr == 'null') {
		arr1 = new Array();
		arr1.push(account1);
	} else {
		arr1 = arr.split(',');
		arr1.push(account1);
	}
	localStorage.setItem('mndApprove3', arr1);

}

async function approveMonth6() {
	tokenContract = new web3.eth.Contract(MindMusicAbi, MindMusicAddr);
	stakeContract6 = new web3.eth.Contract(stakeAbi1, stakeAddr6);
	await tokenContract.methods.approve(stakeAddr6, '0xffffffffffffffffffffff').send({
		from: account6
	});

	$("#contributeButtonMonth6").css('display', 'block');
	$("#approveButtonMonth6").css('display', 'none');

	let arr = localStorage.getItem('mndApprove6');
	let arr1;
	if (arr == null || arr == 'null') {
		arr1 = new Array();
		arr1.push(account1);
	} else {
		arr1 = arr.split(',');
		arr1.push(account1);
	}
	localStorage.setItem('mndApprove6', arr1);
}

/***
 * contract 1 part::
 */

async function stakeMonth1() {
	tokenContract = new web3.eth.Contract(MindMusicAbi, MindMusicAddr);
	stakeContract1 = new web3.eth.Contract(stakeAbi1, stakeAddr1);
	// await tokenContract.methods.approve(stakeAddr1, '0xffffffffffffffffffffff').send({
	// 	from: account1
	// });

	let amount = $("#stakeAmountMonth1").val();
	amount = amount * 1;
	await stakeContract1.methods.deposit(amount).send({
		from: account1
	});
}

async function unstakeMonth1() {
	stakeContract1 = new web3.eth.Contract(stakeAbi1, stakeAddr1);
	let amount = $("#unstakeAmountMonth1").val();
	amount = amount * 1;
	await stakeContract1.methods.withdraw(amount).send({
		from: account1
	});
}

async function unstakeAllMonth1() {
	stakeContract1 = new web3.eth.Contract(stakeAbi1, stakeAddr1);
	await stakeContract1.methods.withdrawAll().send({
		from: account1
	});
}

async function getInfoMonth1() {
	return await stakeContract1.methods.userInfo(account1).call({
		from: account1
	});
}

async function getPoolStartMonth1() {
	return await stakeContract1.methods.startPool.call().call();
}

async function getPoolPeriodMonth1() {
	return await stakeContract1.methods.poolPeriod.call().call();
}

async function getExclusivePeriodMonth1() {
	return await stakeContract1.methods.exclusivePeriod.call().call();
}

async function getLockPeriodMonth1() {
	return await stakeContract1.methods.lockTokenPeriod.call({
		from: account1
	}).call();
}

async function getAPYMonth1() {
	return await stakeContract1.methods.APY.call({
		from: account1
	}).call();
}


/***
 * contract 2 part::
 */

async function stakeMonth3() {
	tokenContract = new web3.eth.Contract(MindMusicAbi, MindMusicAddr);
	stakeContract3 = new web3.eth.Contract(stakeAbi1, stakeAddr3);
	// await tokenContract.methods.approve(stakeAddr3, '0xffffffffffffffffffffff').send({
	// 	from: account3
	// });

	let amount = $("#stakeAmountMonth3").val();
	amount = amount * 1;
	await stakeContract3.methods.deposit(amount).send({
		from: account3
	});
}

async function unstakeMonth3() {
	stakeContract3 = new web3.eth.Contract(stakeAbi1, stakeAddr3);
	let amount = $("#unstakeAmountMonth3").val();
	amount = amount * 1;
	await stakeContract3.methods.withdraw(amount).send({
		from: account3
	});
}

async function unstakeAllMonth3() {
	stakeContract3 = new web3.eth.Contract(stakeAbi1, stakeAddr3);
	await stakeContract3.methods.withdrawAll().send({
		from: account3
	});
}

async function getInfoMonth3() {
	return await stakeContract3.methods.userInfo(account3).call({
		from: account3
	});
}

async function getPoolStartMonth3() {
	return await stakeContract3.methods.startPool.call().call();
}

async function getPoolPeriodMonth3() {
	return await stakeContract3.methods.poolPeriod.call().call();
}

async function getExclusivePeriodMonth3() {
	return await stakeContract3.methods.exclusivePeriod.call().call();
}

async function getLockPeriodMonth3() {
	return await stakeContract3.methods.lockTokenPeriod.call({
		from: account3
	}).call();
}

async function getAPYMonth3() {
	return await stakeContract3.methods.APY.call({
		from: account3
	}).call();
}

/***
 * contract 3 part::
 */

async function stakeMonth6() {
	tokenContract = new web3.eth.Contract(MindMusicAbi, MindMusicAddr);
	stakeContract6 = new web3.eth.Contract(stakeAbi1, stakeAddr6);
	// await tokenContract.methods.approve(stakeAddr6, '0xffffffffffffffffffffff').send({
	// 	from: account6
	// });

	let amount = $("#stakeAmountMonth6").val();
	amount = amount * 1;
	await stakeContract6.methods.deposit(amount).send({
		from: account6
	});
}

async function unstakeMonth6() {
	stakeContract6 = new web3.eth.Contract(stakeAbi1, stakeAddr6);
	let amount = $("#unstakeAmountMonth6").val();
	amount = amount * 1;
	await stakeContract6.methods.withdraw(amount).send({
		from: account6
	});
}

async function unstakeAllMonth6() {
	stakeContract6 = new web3.eth.Contract(stakeAbi1, stakeAddr6);
	await stakeContract6.methods.withdrawAll().send({
		from: account6
	});
}

async function getInfoMonth6() {
	return await stakeContract6.methods.userInfo(account6).call({
		from: account6
	});
}

async function getPoolStartMonth6() {
	return await stakeContract6.methods.startPool.call().call();
}

async function getPoolPeriodMonth6() {
	return await stakeContract6.methods.poolPeriod.call().call();
}

async function getExclusivePeriodMonth6() {
	return await stakeContract6.methods.exclusivePeriod.call().call();
}

async function getLockPeriodMonth6() {
	return await stakeContract6.methods.lockTokenPeriod.call({
		from: account6
	}).call();
}

async function getAPYMonth6() {
	return await stakeContract6.methods.APY.call({
		from: account6
	}).call();
}


(async function ($) {
	// await initWalletConnect();
  $(".dropdown").css('display', 'none');
  $(".drop-2").css('display', 'block');
})(jQuery);

(async function ($) {
	"user strict";

	$("#approveButtonMonth1").attr("disabled", true);
	$("#contributeButtonMonth1").css("display", 'none');
	$("#withdrawButtonMonth1").attr("disabled", true);
	$("#withdrawAllButtonMonth1").attr("disabled", true);

	setTimeout(() => {
		setInterval(async function () {
			if (account1 != '') {
				let lockPeriod = await getLockPeriodMonth1() * 1;
				info1 = await getInfoMonth1();
				let firstStakedTime = info1.firstStakedBlock * 1;
				let time = Math.floor(Date.now() / 1000);
				let amount = info1.amount;
				amount = amount / (10 ** 9);

				if (amount * 1 == 0) {
					$("#stakecountdownMonth1").html('You did not stake token');
					$("#stakecountdownTimerMonth1").css('display', 'none');
					$("#userstakedAmountMonth1").css('display', 'none');
				} else {
					if ((lockPeriod + firstStakedTime) > time) {
						let interval = lockPeriod + firstStakedTime - time;
						let day, hour, minute, second;
						day = Math.floor(interval / 86400);
						interval = interval - day * 86400;
						hour = Math.floor(interval / 3600);
						interval = interval - hour * 3600;
						minute = Math.floor(interval / 60);
						second = interval - minute * 60;
						if (hour < 10) {
							hour = '0' + hour;
						}
						if (minute < 10) {
							minute = '0' + minute;
						}
						if (second < 10) {
							second = '0' + second;
						}
						let str;
						if (day == 0) {
							if (hour == '00') {
								if (minute == '00') {
									if (second == '00') {
										str = '';
									} else {
										str = `${second}S`;
									}
								} else {
									str = `${minute}M : ${second}S`;
								}
							} else {
								str = `${hour}H : ${minute}M : ${second}S`;
							}
						} else {
							str = `${day}D : ${hour}H : ${minute}M : ${second}S`;
						}
						$("#stakecountdownMonth1").html('TIME TILL YOUR TOKENS ARE UNLOCKED');
						$("#stakecountdownTimerMonth1").html(str);

						let reward = await stakeContract1.methods.calcCurrentReward(account1).call();

						reward = reward / (10 ** 9);

						$("#stakedAmountInfoMonth1 span").eq(0).html(amount);
						$("#stakedAmountInfoMonth1 span").eq(1).html(reward.toFixed(5));
						$("#withdrawButtonMonth1").attr("disabled", true);
						$("#stakedAmountInfoMonth1").css('display', 'block');
					} else {
						let reward = await stakeContract1.methods.calcCurrentReward(account1).call();
						reward = reward / (10 ** 9);
						$("#stakedAmountInfoMonth1 span").eq(1).html(reward.toFixed(5));
						$("#stakecountdownMonth1").html('Your tokens are unlocked now');
						$("#stakecountdownTimerMonth1").css('display', 'none');
						info = await getInfoMonth1();
						let amount = info.amount / (10 ** 9);
						$("#stakedAmountInfoMonth1 span").eq(0).html(amount);
						$("#stakedAmountInfoMonth1").css('display', 'block');
						$("#withdrawButtonMonth1").attr("disabled", false);
						$("#withdrawAllButtonMonth1").attr("disabled", false);
					}
				}
			}
		}, 1000);
	}, 2000);
})(jQuery);

(async function ($) {
	"user strict";

	$("#approveButtonMonth3").attr("disabled", true);
	$("#contributeButtonMonth3").css("display", 'none');
	$("#withdrawButtonMonth3").attr("disabled", true);
	$("#withdrawAllButtonMonth3").attr("disabled", true);

	setTimeout(() => {
		setInterval(async function () {
			if (account3 != '') {
				let lockPeriod = await getLockPeriodMonth3() * 1;
				info3 = await getInfoMonth3();
				let firstStakedTime = info3.firstStakedBlock * 1;
				let time = Math.floor(Date.now() / 1000);
				let amount = info3.amount;
				amount = amount / (10 ** 9);

				if (amount * 1 == 0) {
					$("#stakecountdownMonth3").html('You did not stake token');
					$("#stakecountdownTimerMonth3").css('display', 'none');
					$("#userstakedAmountMonth3").css('display', 'none');
				} else {
					if ((lockPeriod + firstStakedTime) > time) {
						let interval = lockPeriod + firstStakedTime - time;
						let day, hour, minute, second;
						day = Math.floor(interval / 86400);
						interval = interval - day * 86400;
						hour = Math.floor(interval / 3600);
						interval = interval - hour * 3600;
						minute = Math.floor(interval / 60);
						second = interval - minute * 60;
						if (hour < 10) {
							hour = '0' + hour;
						}
						if (minute < 10) {
							minute = '0' + minute;
						}
						if (second < 10) {
							second = '0' + second;
						}
						let str;
						if (day == 0) {
							if (hour == '00') {
								if (minute == '00') {
									if (second == '00') {
										str = '';
									} else {
										str = `${second}S`;
									}
								} else {
									str = `${minute}M : ${second}S`;
								}
							} else {
								str = `${hour}H : ${minute}M : ${second}S`;
							}
						} else {
							str = `${day}D : ${hour}H : ${minute}M : ${second}S`;
						}
						$("#stakecountdownMonth3").html('TIME TILL YOUR TOKENS ARE UNLOCKED');
						$("#stakecountdownTimerMonth3").html(str);

						let reward = await stakeContract3.methods.calcCurrentReward(account3).call();

						reward = reward / (10 ** 9);

						$("#stakedAmountInfoMonth3 span").eq(0).html(amount);
						$("#stakedAmountInfoMonth3 span").eq(1).html(reward.toFixed(5));
						$("#withdrawButtonMonth3").attr("disabled", true);
						$("#stakedAmountInfoMonth3").css('display', 'block');
					} else {
						let reward = await stakeContract3.methods.calcCurrentReward(account3).call();
						reward = reward / (10 ** 9);
						$("#stakedAmountInfoMonth3 span").eq(1).html(reward.toFixed(5));
						$("#stakecountdownMonth3").html('Your tokens are unlocked now');
						$("#stakecountdownTimerMonth3").css('display', 'none');
						info = await getInfoMonth3();
						let amount = info.amount / (10 ** 9);
						$("#stakedAmountInfoMonth3 span").eq(0).html(amount);
						$("#stakedAmountInfoMonth3").css('display', 'block');
						$("#withdrawButtonMonth3").attr("disabled", false);
						$("#withdrawAllButtonMonth3").attr("disabled", false);
					}
				}
			}
		}, 1000);
	}, 2000);
})(jQuery);

(async function ($) {
	"user strict";

	$("#approveButtonMonth6").attr("disabled", true);
	$("#contributeButtonMonth6").css("display", 'none');
	$("#withdrawButtonMonth6").attr("disabled", true);
	$("#withdrawAllButtonMonth6").attr("disabled", true);

	setTimeout(() => {
		setInterval(async function () {
			if (account6 != '') {

				let lockPeriod = await getLockPeriodMonth6() * 1;
				info6 = await getInfoMonth6();

				let firstStakedTime = info6.firstStakedBlock * 1;
				let time = Math.floor(Date.now() / 1000);
				let amount = info6.amount;
				amount = amount / (10 ** 9);

				if (amount * 1 == 0) {
					$("#stakecountdownMonth6").html('You did not stake token');
					$("#stakecountdownTimerMonth6").css('display', 'none');
					$("#userstakedAmountMonth6").css('display', 'none');
				} else {
					if ((lockPeriod + firstStakedTime) > time) {
						let interval = lockPeriod + firstStakedTime - time;
						let day, hour, minute, second;
						day = Math.floor(interval / 86400);
						interval = interval - day * 86400;
						hour = Math.floor(interval / 3600);
						interval = interval - hour * 3600;
						minute = Math.floor(interval / 60);
						second = interval - minute * 60;
						if (hour < 10) {
							hour = '0' + hour;
						}
						if (minute < 10) {
							minute = '0' + minute;
						}
						if (second < 10) {
							second = '0' + second;
						}
						let str;
						if (day == 0) {
							if (hour == '00') {
								if (minute == '00') {
									if (second == '00') {
										str = '';
									} else {
										str = `${second}S`;
									}
								} else {
									str = `${minute}M : ${second}S`;
								}
							} else {
								str = `${hour}H : ${minute}M : ${second}S`;
							}
						} else {
							str = `${day}D : ${hour}H : ${minute}M : ${second}S`;
						}
						$("#stakecountdownMonth6").html('TIME TILL YOUR TOKENS ARE UNLOCKED');
						$("#stakecountdownTimerMonth6").html(str);

						let reward = await stakeContract6.methods.calcCurrentReward(account6).call();

						reward = reward / (10 ** 9);

						$("#stakedAmountInfoMonth6 span").eq(0).html(amount);
						$("#stakedAmountInfoMonth6 span").eq(1).html(reward.toFixed(5));
						$("#withdrawButtonMonth6").attr("disabled", true);
						$("#stakedAmountInfoMonth6").css('display', 'block');
					} else {
						let reward = await stakeContract6.methods.calcCurrentReward(account6).call();
						reward = reward / (10 ** 9);
						$("#stakedAmountInfoMonth6 span").eq(1).html(reward.toFixed(5));
						$("#stakecountdownMonth6").html('Your tokens are unlocked now');
						$("#stakecountdownTimerMonth6").css('display', 'none');
						info = await getInfoMonth6();
						let amount = info.amount / (10 ** 9);
						$("#stakedAmountInfoMonth6 span").eq(0).html(amount);
						$("#stakedAmountInfoMonth6").css('display', 'block');
						$("#withdrawButtonMonth6").attr("disabled", false);
						$("#withdrawAllButtonMonth6").attr("disabled", false);
					}
				}
			}
		}, 1000);
	}, 2000);
})(jQuery);
