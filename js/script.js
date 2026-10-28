// js/script.js

monogatari.characters({
	'h': {
		name: '',
		color: '#ffffff'
	}
});

// Глобальное состояние камеры с раздельными текущими и целевыми координатами
window.cameraState = {
	currentX: 0,
	currentY: 0,
	currentScale: 100,

	targetX: 0,
	targetY: 0,
	targetScale: 100,

	// Скорость плавного догона базы при смене блоков
	lerpSpeed: 0.04
};

window.camera = function (offsetX, offsetY, scalePercent) {
	return function () {
		window.cameraState.targetX = offsetX;
		window.cameraState.targetY = offsetY;
		window.cameraState.targetScale = scalePercent;
		return true;
	};
};

// Цикл ультра-выразительного покачивания (ИГРА + ГЛАВНОЕ МЕНЮ)
(function startGlobalCinemaCamera() {
	let time = 0;

	function updateCamera() {
		const state = window.cameraState;

		// 1. Мягкий догон целевой точки параллакса (для игрового процесса)
		state.currentX += (state.targetX - state.currentX) * state.lerpSpeed;
		state.currentY += (state.targetY - state.currentY) * state.lerpSpeed;
		state.currentScale += (state.targetScale - state.currentScale) * state.lerpSpeed;

		// 2. Размашистая амплитуда покачивания (60px на 40px)
		time += 0.002;
		const swayX = Math.sin(time * 1.1) * 60;
		const swayY = Math.cos(time * 0.75) * 40;

		const finalX = state.currentX + swayX;
		const finalY = state.currentY + swayY;

		// ==========================================
		// ЧАСТЬ 1: ОЖИВЛЕНИЕ СТАРТОВОГО ЭКРАНА (МЕНЮ)
		// ==========================================
		const mainMenuScreen = document.querySelector('[data-screen="main"]');
		if (mainMenuScreen) {
			/* 
			   Поскольку фон главного меню задан через CSS background-image,
			   мы плавно качаем его позицию на 20% (как и бэкграунд в игре)
			*/
			const menuBackX = finalX * 0.2;
			const menuBackY = finalY * 0.2;

			// Смещаем фоновую позицию относительно стандартного центра (50% 50%)
			mainMenuScreen.style.setProperty(
				'background-position',
				`calc(50% + ${menuBackX}px) calc(50% + ${menuBackY}px)`,
				'important'
			);
		}

		// ==========================================
		// ЧАСТЬ 2: ОЖИВЛЕНИЕ ИГРОВОГО ПРОЦЕССА
		// ==========================================
		// Рендер переднего плана (Персонаж в шляпе)
		const frontImg = document.querySelector('[data-screen="game"] [data-image*="_front"]');
		if (frontImg) {
			const targetX = `calc(50% - 0px + ${finalX}px)`;
			const targetY = `calc(50% + 100px + ${finalY}px)`;

			frontImg.style.setProperty('object-position', `${targetX} ${targetY}`, 'important');
			frontImg.style.setProperty('transform', `scale(${state.currentScale / 100})`, 'important');
		}

		// Рендер заднего плана (Фон сцены)
		const backImg = document.querySelector('[data-screen="game"] [data-image*="_back"]');
		if (backImg) {
			const backX = finalX * 0.2;
			const backY = finalY * 0.2;

			backImg.style.setProperty('transform', `scale(1.25) translate(${backX}px, ${backY}px)`, 'important');
		}

		requestAnimationFrame(updateCamera);
	}

	document.addEventListener("DOMContentLoaded", () => {
		requestAnimationFrame(updateCamera);
	});
})();

monogatari.script({
	// Точка входа в игру
	'Start': [
		function () {
			// Если игрок начинает заново — гарантированно включаем дождь обратно
			const canvas = document.getElementById('rainCanvas');
			if (canvas) canvas.style.display = 'block';
			return true;
		},
		'play music ambient_scene1 loop',
		'show image scene_1_back with fadeIn',
		'show image scene_1_front with fadeIn',
		'wait 3000',
		'jump scene_1'
	],

	// --- СЦЕНА 1 ---
	'scene_1': [
		'play sound scene_1_block_1',
		'h Танец - это сексуально? Натурные изгибы тела, форменные телесные впадины, четко выраженные формы.',

		'stop sound',
		'play sound scene_1_block_2',
		'h Жар, исходящий от партнера. Дыхание лицо в лицо.',

		'stop sound',
		'play sound scene_1_block_3',
		'h Такие мгновения никогда не покидают разум, они фиксируются отпечатком в памяти невольного дуэта до сочтения дней их, до того, как сама жизнь не решит что хватит и не поставит точку.',

		'jump scene_2'
	],

	// --- СЦЕНА 2 ---
	'scene_2': [
		'hide image scene_1_back with fadeOut',
		'hide image scene_1_front with fadeOut',
		'show image scene_2_back with fadeIn',
		'show image scene_2_front with fadeIn',

		'stop music',
		'play music ambient_scene2 loop',
		'stop sound',
		'play sound scene_2_block_1',

		'h Тем более если это происходит в совсем неподходящем для танца месте.',

		'stop sound',
		'play sound scene_2_block_2',
		'h А именно - на плато. На таком плато, где нет ни единой дороги вниз.',

		'stop sound',
		'play sound scene_2_block_3',
		'h Тот кто попадает на эту изолированную от мира платформу, никогда сам ее не покинет: со всех сторон окружен он обрывом, обрывом, уходящим буквально в бездну.',

		'stop sound',
		'play sound scene_2_block_4',
		'h Лишь вертолет или дирижабль был в состоянии увезти посетителя с этого ужасающего места.',

		'jump scene_3'
	],

	// --- СЦЕНА 3 ---
	'scene_3': [
		'hide image scene_2_back with fadeOut',
		'hide image scene_2_front with fadeOut',
		'show image scene_3_back with fadeIn',
		'show image scene_3_front with fadeIn',

		'stop music',
		'play music ambient_scene3 loop',
		'stop sound',
		'play sound scene_3_block_1',
		'h Не только место было неподходящим, но и время. Темная, непроглядная ночь.',

		'stop sound',
		'play sound scene_3_block_2',
		'h Яркий прожектор, освещающий танцующую пару бил прямо с неба, и тьма покорно расщеплялась под напором его фотонов.',

		'stop sound',
		'play sound scene_3_block_3',
		'h Он был закреплен на большом дирижабле, который перекрывал собой бОльшую часть полуночного неба.',

		'stop sound',
		'play sound scene_3_block_4',
		'h Его круглый, вытянутый корпус с одной стороны был освещен луной, и вся конструкция парила как раз над самыми головами танцующих.',

		'jump scene_4'
	],

	// --- СЦЕНА 4 ---
	'scene_4': [
		'hide image scene_3_back with fadeOut',
		'hide image scene_3_front with fadeOut',
		'show image scene_4_back with fadeIn',
		'show image scene_4_front with fadeIn',

		'stop music',
		'play music ambient_scene4 loop',
		'stop sound',
		'play sound scene_4_block_1',
		'h Черные туфли мужчины были начищены до такого блеска, что лунный свет на них переходил в коричневатые оттенки.',

		'stop sound',
		'play sound scene_4_block_2',
		'h Туфли мягко утопали в низкой, идеально подстриженной траве.',

		'stop sound',
		'play sound scene_4_block_3',
		'h Дамские же туфельки, представляющие собой скорее подошву с веревочками, почти полностью утопали в газоне, и лишь слегка сплющивали нежную ступню.',

		'jump scene_5'
	],

	// --- СЦЕНА 5 ---
	'scene_5': [
		'hide image scene_4_back with fadeOut',
		'hide image scene_4_front with fadeOut',
		'show image scene_5_back with fadeIn',
		'show image scene_5_front with fadeIn',

		'stop music',
		'play music ambient_scene5 loop',
		'stop sound',
		'play sound scene_5_block_1',
		'h Пара кружилась, пара несла друг друга и растворялась друг в друге. Он обнимал ее собой а она была вся в нем.',

		'stop sound',
		'play sound scene_5_block_2',
		'h Музыка? Музыка звучала настолько громко, что не было слышно даже собственного дыхания.',

		'stop sound',
		'play sound scene_5_block_3',
		'h В некоторый момент наши танцоры даже испытали страх, что их барабанные перепонки могут не выдержать и лопнут. Звук так же доносился с неба, из дирижабля.',

		'jump scene_6'
	],
	// --- СЦЕНА 6 ---
	'scene_6': [
		'hide image scene_5_back with fadeOut',
		'hide image scene_5_front with fadeOut',
		'show image scene_6_back with fadeIn',
		'show image scene_6_front with fadeIn',

		'stop music',
		'play music ambient_scene6 loop',
		'stop sound',
		'play sound scene_6_block_1',
		'h Ее ноги, слегка липкие от пота, горячие, были тверды как сталь и мягкие как масло.',

		'stop sound',
		'play sound scene_6_block_2',
		'h Допустимо мягкие, скорее упругие. Текстура чулков, а выше талия.',

		'stop sound',
		'play sound scene_6_block_3',
		'h Такая композиция могла превзойти любое произведение искусства ибо являлась оригиналом, с которого рисовались, лепились, создавались все мировые шедевры.',

		'jump scene_7'
	],
	// --- СЦЕНА 7 ---
	'scene_7': [
		window.camera(0, 0, 160),
		'hide image scene_6_back with fadeOut',
		'hide image scene_6_front with fadeOut',
		'show image scene_7_back with fadeIn',
		'show image scene_7_front with fadeIn',

		'stop music',
		'play music ambient_scene7 loop',
		'stop sound',
		'play sound scene_7_block_1',
		'h Он был большим, а его запах буквально ставил ее на колени.',

		'stop sound',
		'play sound scene_7_block_2',
		'h Каждый виток танца, каждый легкий его поворот окутывал ее густым слоем его духов, резких, индикаторно-мужских, идеально-мужчинских, наполненных каким-то другим, не ее смыслом.',

		'stop sound',
		'play sound scene_7_block_3',
		'h Он пах другой философией, и ей это было приятно. Она не знала каким, но знала точно, что очень наполненным чуждой ей атмосферой, тем, о чем мужчины не говорят, максимум шепчутся.',

		'stop sound',
		'play sound scene_7_block_4',
		'h Это их секреты, их тайны, передающиеся от мужчины мужчине, от мальчика мальчику, но о них не говорят женщинам.',

		'jump scene_8'
	],
	// --- СЦЕНА 8 ---
	'scene_8': [
		'hide image scene_7_back with fadeOut',
		'hide image scene_7_front with fadeOut',
		'show image scene_8_back with fadeIn',
		'show image scene_8_front with fadeIn',

		'stop music',
		'play music ambient_scene8 loop',
		'stop sound',
		'play sound scene_8_block_1',
		'h Танец не заканчивался, он длился уже несколько лет, даже десятилетий, но танцоры ни капли не устали.',

		'stop sound',
		'play sound scene_8_block_2',
		'h Наоборот. Танец давал им силы, давал им энергию и какой-то таинственный интерес.',

		'stop sound',
		'play sound scene_8_block_3',
		'h Именно этот интерес двигал их вперед, этот интерес вел их, кружил их и прижимал друг к другу.',

		'stop sound',
		'play sound scene_8_block_4',
		'h Они были знакомы очень давно, несмотря на столь юный их возраст. Они прекрасно знали этот танец.',

		'stop sound',
		'play sound scene_8_block_5',
		'h Столь же точно он знал куда она в следующий миг поставит ногу, а она с той же уверенностью знала с какой силой его рука сожмет ее талию в следующем обороте.',

		'jump scene_9'
	],
	// --- СЦЕНА 9 ---
	'scene_9': [
		'hide image scene_8_back with fadeOut',
		'hide image scene_8_front with fadeOut',
		'show image scene_9_back with fadeIn',
		'show image scene_9_front with fadeIn',

		'stop music',
		'play music ambient_scene9 loop',
		'stop sound',
		'play sound scene_9_block_1',
		'h Последним что видели наши танцоры стала вспышка. Вспышка темноты.',

		'stop sound',
		'play sound scene_9_block_2',
		'h Дирижабль без никакого предупреждения пропал, буквально вспыхнул и исчез.',

		'stop sound',
		'play sound scene_9_block_3',
		'h Музыка, прекрасная классика в миг замолчала. Все погрузилось в полную тишину, в тьму.',

		'stop sound',
		'play sound scene_9_block_4',
		'h Она открыла глаза. Настенные часы показывали 3 часа ночи.',

		'stop sound',
		'play sound scene_9_block_5',
		'h На прикроватной тумбочке по прежнему лежали ее таблетки, очки в большой старой оправе, и две рамки с черно-белыми фото.',

		'stop sound',
		'play sound scene_9_block_6',
		'h На одной фото ее внуки. На второй фото - тот, над кем мгновение назад пропал дирижабль.',

		'stop sound',
		'jump scene_final'
	],
	// Финальная сцена
	'scene_final': [
		// 1. ЖЕСТКИЙ ФИКС: Сначала полностью очищаем экран от старых картинок и фонов
		'clear',

		// 2. Останавливаем музыку предыдущей сцены
		'stop music',
		'stop sound',

		// 3. Запускаем финальный эмбиент Scene_7.ogg по кругу
		'play music ambient_scene9 loop',

		// 4. Мягко выводим финальный арт на весь экран
		'show image final_cover with fadeIn',

		// 5. ТОЛЬКО ТЕПЕРЬ активируем финальные стили и включаем саму кнопку
		function () {
			// Скрываем текстовое поле и кнопку "Далее" через класс body
			document.body.classList.add('in-final-scene');

			// Включаем отображение кнопки Boosty СТРОГО ПОСЛЕ команды 'clear'
			const finalBtn = document.getElementById('custom-final-boosty-btn');
			if (finalBtn) {
				finalBtn.style.setProperty('display', 'block', 'important');
				console.log("🎯 [УСПЕХ] Финальная кнопка принудительно отображена в DOM.");
			} else {
				console.error("❌ [КРИТ] Элемент #custom-final-boosty-btn не найден на странице!");
			}
			return true;
		},

		// Переносим паузу в самый конец, чтобы она не блокировала выполнение функции выше
		'wait 2000'
	]
});


monogatari.assets('music', {
	'ambient_scene1': 'Scene_1.ogg',
	'ambient_scene2': 'Scene_2.ogg',
	'ambient_scene3': 'Scene_3.ogg',
	'ambient_scene4': 'Scene_4.ogg',
	'ambient_scene5': 'Scene_5.ogg',
	'ambient_scene6': 'Scene_6.ogg',
	'ambient_scene7': 'Scene_7.ogg',
	'ambient_scene8': 'Scene_8.ogg',
	'ambient_scene9': 'Scene_9.ogg',
});

monogatari.assets('sounds', {
	'scene_1_block_1': 'scene_1_block_1.ogg',
	'scene_1_block_2': 'scene_1_block_2.ogg',
	'scene_1_block_3': 'scene_1_block_3.ogg',
	'scene_1_block_4': 'scene_1_block_4.ogg',
	'scene_1_block_5': 'scene_1_block_5.ogg',

	'scene_2_block_1': 'scene_2_block_1.ogg',
	'scene_2_block_2': 'scene_2_block_2.ogg',
	'scene_2_block_3': 'scene_2_block_3.ogg',
	'scene_2_block_4': 'scene_2_block_4.ogg',
	'scene_2_block_5': 'scene_2_block_5.ogg',
	'scene_2_block_6': 'scene_2_block_6.ogg',
	'scene_2_block_7': 'scene_2_block_7.ogg',

	'scene_3_block_1': 'scene_3_block_1.ogg',
	'scene_3_block_2': 'scene_3_block_2.ogg',
	'scene_3_block_3': 'scene_3_block_3.ogg',
	'scene_3_block_4': 'scene_3_block_4.ogg',
	'scene_3_block_5': 'scene_3_block_5.ogg',
	'scene_3_block_6': 'scene_3_block_6.ogg',
	'scene_3_block_7': 'scene_3_block_7.ogg',
	'scene_3_block_8': 'scene_3_block_8.ogg',
	'scene_3_block_9': 'scene_3_block_9.ogg',

	'scene_4_block_1': 'scene_4_block_1.ogg',
	'scene_4_block_2': 'scene_4_block_2.ogg',
	'scene_4_block_3': 'scene_4_block_3.ogg',
	'scene_4_block_4': 'scene_4_block_4.ogg',
	'scene_4_block_5': 'scene_4_block_5.ogg',

	'scene_5_block_1': 'scene_5_block_1.ogg',
	'scene_5_block_2': 'scene_5_block_2.ogg',
	'scene_5_block_3': 'scene_5_block_3.ogg',
	'scene_5_block_4': 'scene_5_block_4.ogg',
	'scene_5_block_5': 'scene_5_block_5.ogg',
	'scene_5_block_6': 'scene_5_block_6.ogg',
	'scene_5_block_7': 'scene_5_block_7.ogg',
	'scene_5_block_8': 'scene_5_block_8.ogg',

	'scene_6_block_1': 'scene_6_block_1.ogg',
	'scene_6_block_2': 'scene_6_block_2.ogg',
	'scene_6_block_3': 'scene_6_block_3.ogg',
	'scene_6_block_4': 'scene_6_block_4.ogg',
	'scene_6_block_5': 'scene_6_block_5.ogg',
	'scene_6_block_6': 'scene_6_block_6.ogg',

	'scene_7_block_1': 'scene_7_block_1.ogg',
	'scene_7_block_2': 'scene_7_block_2.ogg',
	'scene_7_block_3': 'scene_7_block_3.ogg',
	'scene_7_block_4': 'scene_7_block_4.ogg',
	'scene_7_block_5': 'scene_7_block_5.ogg',

	'scene_8_block_1': 'scene_8_block_1.ogg',
	'scene_8_block_2': 'scene_8_block_2.ogg',
	'scene_8_block_3': 'scene_8_block_3.ogg',
	'scene_8_block_4': 'scene_8_block_4.ogg',
	'scene_8_block_5': 'scene_8_block_5.ogg',
	'scene_8_block_6': 'scene_8_block_6.ogg',
	'scene_8_block_7': 'scene_8_block_7.ogg',

	'scene_9_block_1': 'scene_9_block_1.ogg',
	'scene_9_block_2': 'scene_9_block_2.ogg',
	'scene_9_block_3': 'scene_9_block_3.ogg',
	'scene_9_block_4': 'scene_9_block_4.ogg',
	'scene_9_block_5': 'scene_9_block_5.ogg',
	'scene_9_block_6': 'scene_9_block_6.ogg',
	'scene_9_block_7': 'scene_9_block_7.ogg',
	'scene_9_block_8': 'scene_9_block_8.ogg',
	'scene_9_block_9': 'scene_9_block_9.ogg'
});

// Регистрируем слои картинок (ищутся в assets/images/)
monogatari.assets('images', {
	// Сцена 1
	'scene_1_front': 'scene_1_front.webp',
	'scene_1_back': 'scene_1_back.webp',

	// Сцена 2
	'scene_2_front': 'scene_2_front.webp',
	'scene_2_back': 'scene_2_back.webp',

	// Сцена 3
	'scene_3_front': 'scene_3_front.webp',
	'scene_3_back': 'scene_3_back.webp',

	// Сцена 4
	'scene_4_front': 'scene_4_front.webp',
	'scene_4_back': 'scene_4_back.webp',

	// Сцена 5
	'scene_5_front': 'scene_5_front.webp',
	'scene_5_back': 'scene_5_back.webp',

	// Сцена 6
	'scene_6_front': 'scene_6_front.webp',
	'scene_6_back': 'scene_6_back.webp',

	// Сцена 7
	'scene_7_front': 'scene_7_front.webp',
	'scene_7_back': 'scene_7_back.webp',

	// Сцена 8
	'scene_8_front': 'scene_8_front.webp',
	'scene_8_back': 'scene_8_back.webp',

	// Сцена 8
	'scene_9_front': 'scene_9_front.webp',
	'scene_9_back': 'scene_9_back.webp',

	// Сцена Финал
	'final_cover': 'final_scene_cover.webp'
});

