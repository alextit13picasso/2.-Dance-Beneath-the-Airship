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
		time += 0.012;
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
			const targetX = `calc(50% - 60px + ${finalX}px)`;
			const targetY = `calc(50% + 340px + ${finalY}px)`;

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
		window.camera(0, 0, 100),
		'h Is dance a carnal thing? The natural curves of a body, the distinct contours of flesh, the sharp silhouettes of form.',

		'stop sound',
		'play sound scene_1_block_2',
		window.camera(30, -20, 112),
		'h The heat radiating from a partner. Breath against breath.',

		'stop sound',
		'play sound scene_1_block_3',
		window.camera(35, 85, 100),
		'h Such moments never truly leave the mind; they imprint themselves onto the memory of the involuntary duet until the end of their days, until life itself decides it is enough and cuts the thread.',

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

		window.camera(0, 0, 100),
		'h More so when it unfolds in a place entirely unsuited for dance. Upon a plateau.',

		'stop sound',
		'play sound scene_2_block_2',
		window.camera(25, -15, 108),
		'h A solitary plateau with not a single path leading down. Whosoever sets foot on this lonely platform, isolated from the rest of the world, shall never leave it by their own hand.',

		'stop sound',
		'play sound scene_2_block_3',
		window.camera(-30, 10, 105),
		'h On every side, they are hemmed in by a precipice—a sheer drop yawning into the literal abyss.',

		'stop sound',
		'play sound scene_2_block_4',
		window.camera(45, -25, 115),
		'h Only a helicopter or an airship could ever carry a soul away from this terrifying ledge.',

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
		window.camera(25, 10, 100),
		'h It was not merely the setting that was ill-chosen, but the hour. A dark, impenetrable night.',

		'stop sound',
		'play sound scene_3_block_2',
		window.camera(15, 20, 106),
		'h A brilliant spotlight, cutting straight down from the heavens, bathed the dancing couple in light, the darkness meekly splintering under the weight of its photons.',

		'stop sound',
		'play sound scene_3_block_3',
		window.camera(-40, -20, 112),
		'h The beam belonged to a massive airship that blotted out the greater part of the midnight sky.',

		'stop sound',
		'play sound scene_3_block_4',
		window.camera(35, -10, 107),
		'h Its rounded, elongated hull was caught on one side by the glow of the moon, the entire structure hovering just above the dancers\' heads.',

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
		window.camera(0, 0, 100),
		'h The man’s black shoes were polished to such a mirror shine that the reflected moonlight took on deep, brownish undertones.',

		'stop sound',
		'play sound scene_4_block_2',
		window.camera(-15, -15, 103),
		'h His soles sank softly into the low, immaculately manicured grass.',

		'stop sound',
		'play sound scene_4_block_3',
		window.camera(60, 0, 120),
		'h The lady’s slippers, which were little more than thin soles bound by delicate threads, were swallowed almost entirely by the lawn, gently pressing against the tender contours of her feet.',

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
		window.camera(0, 0, 100),
		'h Around and around they spun, carrying one another, dissolving into each other.',

		'stop sound',
		'play sound scene_5_block_2',
		window.camera(35, -10, 107),
		'h He enveloped her entirely, and she was wholly lost in him. The music?',

		'stop sound',
		'play sound scene_5_block_3',
		window.camera(25, -15, 108),
		'h It thundered so loudly that one could not hear the sound of their own breath.',

		'stop sound',
		'play sound scene_5_block_4',
		window.camera(-30, 10, 105),
		'h For a fleeting second, a tremor of fear struck them—a dread that their eardrums might surrender and snap under the strain.',

		'stop sound',
		'play sound scene_5_block_5',
		window.camera(45, -25, 115),
		'h The sound, too, cascaded from above, echoing from the belly of the airship.',

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
		window.camera(0, 0, 100),
		'h Her legs, damp with a faint sheen of sweat and warm to the touch, felt as unyielding as steel yet as soft as butter.',

		'stop sound',
		'play sound scene_6_block_2',
		window.camera(15, 20, 106),
		'h A permissible softness; elastic, resilient.',

		'stop sound',
		'play sound scene_6_block_3',
		window.camera(-40, -20, 112),
		'h The textured friction of stockings, and higher still, the curve of her waist.',

		'stop sound',
		'play sound scene_6_block_4',
		window.camera(35, -10, 107),
		'h Such a composition could eclipse any masterwork of art, for it was the primal source from which all the world’s masterpieces were drawn, sculpted, and brought to life.',

		'jump scene_7'
	],
	// --- СЦЕНА 7 ---
	'scene_7': [
		'hide image scene_6_back with fadeOut',
		'hide image scene_6_front with fadeOut',
		'show image scene_7_back with fadeIn',
		'show image scene_7_front with fadeIn',

		function () {
			/* ЖЕЛЕЗОБЕТОННЫЙ ВЫКЛЮЧАТЕЛЬ: 
			   Находим холст дождя по ID и полностью скрываем его из видимости */
			const canvas = document.getElementById('rainCanvas');
			if (canvas) {
				canvas.style.display = 'none';
			}
			return true; // Важно вернуть true, чтобы Monogatari пошел дальше по сценарию
		},

		'stop music',
		'play music ambient_scene7 loop',
		'stop sound',
		'play sound scene_7_block_1',
		window.camera(0, 0, 100),
		'h He was large, and his scent possessed a weight that practically forced her to her knees.',

		'stop sound',
		'play sound scene_7_block_2',
		window.camera(-45, 65, 115),
		'h With every swirl of the dance, every subtle turn, a thick layer of his cologne enveloped her—sharp, inherently masculine, perfectly virile, charged with a meaning entirely foreign to her own.',

		'stop sound',
		'play sound scene_7_block_3',
		window.camera(0, 55, 110),
		'h He smelled of an alien philosophy, and she found a quiet pleasure in it.',

		'stop sound',
		'play sound scene_7_block_4',
		window.camera(-75, 75, 103),
		'h She could not name that philosophy, yet she knew with absolute certainty that it was saturated with a world she did not belong to—the things men never speak of aloud, whispering them at most.',

		'stop sound',
		'play sound scene_7_block_5',
		window.camera(-45, 65, 115),
		'h These are their secrets, their mysteries, handed down from man to man, from boy to boy, never to be uttered before a woman.',

		'show scene #000000 with fadeIn',
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
		window.camera(0, 0, 100),
		'h The dance did not cease; it had lingered now for several years, perhaps even decades, yet the dancers felt not the slightest touch of weariness.',

		'stop sound',
		'play sound scene_8_block_2',
		window.camera(15, 20, 106),
		'h Quite the contrary.',

		'stop sound',
		'play sound scene_8_block_3',
		window.camera(-40, -20, 112),
		'h The movement lent them strength, feeding them vitality and a certain haunting curiosity.',

		'stop sound',
		'play sound scene_8_block_4',
		window.camera(35, -10, 107),
		'h It was this curiosity that urged them forward, leading them, spinning them, pressing their bodies tight against one another.',

		'stop sound',
		'play sound scene_8_block_5',
		window.camera(-45, 65, 115),
		'h They had known each other for an eternity, despite their seemingly tender age.',

		'stop sound',
		'play sound scene_8_block_6',
		window.camera(-75, 75, 103),
		'h They knew the geometry of this dance by heart.',

		'stop sound',
		'play sound scene_8_block_7',
		window.camera(15, 20, 106),
		'h With that same effortless precision, he knew exactly where her foot would fall in the next heartbeat, and she knew with equal certainty the exact measure of force with which his hand would cradle her waist in the coming turn.',

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
		window.camera(0, 0, 100),
		'h The final thing our dancers beheld was a flash.',

		'stop sound',
		'play sound scene_9_block_2',
		window.camera(15, 20, 106),
		'h A flash of darkness. Without a syllable of warning, the airship vanished—literally flickering out of existence.',

		'stop sound',
		'play sound scene_9_block_3',
		window.camera(-40, -20, 112),
		'h The music, a beautiful classical piece, died in an instant.',

		'stop sound',
		'play sound scene_9_block_4',
		window.camera(35, -10, 107),
		'h Everything was plunged into an absolute, suffocating silence, into the dark.',

		'stop sound',
		'play sound scene_9_block_5',
		window.camera(-45, 65, 115),
		'hShe opened her eyes.',

		'stop sound',
		'play sound scene_9_block_6',
		window.camera(-75, 75, 103),
		'h The wall clock read 3:12 in the morning.',

		'stop sound',
		'play sound scene_9_block_7',
		window.camera(15, 20, 106),
		'h Upon the bedside nightstand lay her pills, as they always did, alongside her glasses in their large, old frame, and two framed black-and-white photographs.',

		'stop sound',
		'play sound scene_9_block_8',
		window.camera(-45, 65, 115),
		'h In one picture were her grandchildren.',

		'stop sound',
		'play sound scene_9_block_9',
		window.camera(35, -10, 107),
		'h In the second was the man over whose head, a mere heartbeat ago, the airship had vanished.',

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
		'play music ambient_scene7 loop',

		// 4. Мягко выводим финальный арт на весь экран
		'show image final_cover with fadeIn',

		function () {
			/* ЖЕЛЕЗОБЕТОННЫЙ ВЫКЛЮЧАТЕЛЬ ДОЖДЯ: 
			   Находим холст дождя по ID и полностью скрываем его из видимости */
			const canvas = document.getElementById('rainCanvas');
			if (canvas) {
				canvas.style.display = 'none';
			}
			return true;
		},

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
	'ambient_scene7': 'Scene_7.ogg'
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
	'scene_7_block_4': 'scene_7_block_4.ogg'
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

	// Сцена Финал
	'final_cover': 'final_scene_cover.webp',
	'final_button_asset': 'final_button.webp',
});

