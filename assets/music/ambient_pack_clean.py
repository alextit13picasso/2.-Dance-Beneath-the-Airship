import numpy as np
from scipy.io import wavfile
import os
import random
import subprocess

def prepare_source_sample(m4a_path="guitar_sample.m4a", target_wav="guitar_source.wav", sample_rate=22050):
    if not os.path.exists(m4a_path):
        print(f"❌ Ошибка: Исходный файл {m4a_path} не найден!")
        return False
    cmd = f'ffmpeg -i "{m4a_path}" -ac 1 -ar {sample_rate} -y "{target_wav}"'
    subprocess.run(cmd, shell=True, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
    return os.path.exists(target_wav)

def change_pitch_only(data, pitch_factor):
    """Меняем только тональность (высоту) без пулеметных повторов"""
    old_indices = np.arange(0, len(data))
    new_indices = np.arange(0, len(data), pitch_factor)
    return np.interp(new_indices, old_indices, data)

def apply_soft_lowpass(data, alpha=0.25):
    """Легкий фильтр убирает лишний звон, сохраняя натуральность струн"""
    filtered_data = np.zeros_like(data)
    filtered_data[0] = data[0]
    for i in range(1, len(data)):
        filtered_data[i] = alpha * data[i] + (1 - alpha) * filtered_data[i-1]
    return filtered_data

def generate_hybrid_track(scene_num, source_wav="guitar_source.wav", duration=20, sample_rate=22050):
    num_samples = duration * sample_rate
    
    sr, guitar_data = wavfile.read(source_wav)
    guitar_data = guitar_data.astype(np.float32) / 32767.0
    
    # 1. СЛУЧАЙНОЕ ОКНО ИЗ ИСХОДНИКА (Сэмпл 46 сек позволяет вырезать уникальные 20 сек)
    max_start_sample = len(guitar_data) - num_samples
    if max_start_sample > 0:
        start_idx = random.randint(0, max_start_sample)
        guitar_chunk = guitar_data[start_idx:start_idx + num_samples]
    else:
        # Если сэмпл вдруг оказался короче, просто берем его целиком
        guitar_chunk = guitar_data
        
    # 2. ЕСТЕСТВЕННАЯ ОБРАБОТКА (Без пулеметного ускорения)
    # Слегка меняем тональность для каждой сцены (от глубокого баса до оригинала)
    pitch_factor = random.uniform(0.75, 1.05)
    guitar_processed = change_pitch_only(guitar_chunk, pitch_factor)
    
    # Смягчаем верхние частоты, убираем резкие щелчки медиатора
    guitar_processed = apply_soft_lowpass(guitar_processed, alpha=0.2)
    
    # Гарантируем точную длину
    if len(guitar_processed) < num_samples:
        guitar_processed = np.pad(guitar_processed, (0, num_samples - len(guitar_processed)))
    else:
        guitar_processed = guitar_processed[:num_samples]
        
    # 3. КИНЕМАТОГРАФИЧЕСКОЕ ЭХО (Дилей для объема «в пустой комнате»)
    delay_samples = int(0.4 * sample_rate) # Длинная задержка (400 мс)
    echo = np.zeros_like(guitar_processed)
    echo[delay_samples:] = guitar_processed[:-delay_samples] * 0.35

    # 4. ГЕНЕРАЦИЯ ЖИВОГО ВЕТРА
    white_noise = np.random.normal(0, 1, num_samples)
    brown_noise = np.cumsum(white_noise)
    brown_noise /= np.max(np.abs(brown_noise))
    
    wind_speed = random.uniform(0.08, 0.22)
    wind_mod = 0.5 + 0.5 * np.sin(2 * np.pi * wind_speed * np.linspace(0, duration, num_samples))
    wind = brown_noise * wind_mod * random.uniform(0.35, 0.45)
    
    # Сведение (балансируем гитару и ветер)
    mixed = wind + ((guitar_processed + echo) * 0.4)
    
    # 5. БЕСШОВНЫЙ КРОССФЕЙД КРАЕВ (1.5 секунды для идеального Loop без щелчков на стыке)
    fade_samples = int(1.5 * sample_rate)
    fade_in = np.linspace(0, 1, fade_samples)
    fade_out = np.linspace(1, 0, fade_samples)
    mixed[:fade_samples] *= fade_in
    mixed[-fade_samples:] *= fade_out
    
    mixed = mixed / np.max(np.abs(mixed)) * 0.65
    audio_data = (mixed * 32767).astype(np.int16)
    
    wav_temp = f"temp_scene_{scene_num}.wav"
    ogg_name = f"Scene_{scene_num}.ogg"
    
    wavfile.write(wav_temp, sample_rate, audio_data)
    
    # Пакетное сжатие в легкий OGG через твой FFmpeg [conversation]
    cmd = f'ffmpeg -i "{wav_temp}" -c:a libvorbis -q:a 1 -ar 22050 -ac 1 -y "{ogg_name}"'
    subprocess.run(cmd, shell=True, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
    
    if os.path.exists(wav_temp):
        os.remove(wav_temp)
        
    print(f"🎵 [КОНВЕЙЕР] Сцена {scene_num} собрана: {ogg_name} | Тональность: {pitch_factor:.2f}x")

if __name__ == "__main__":
    print("🚀 Старт гибридного конвейера под длинный сэмпл...")
    source_wav = "guitar_source.wav"
    if prepare_source_sample("guitar_sample.m4a", source_wav):
        for i in range(1, 11):
            generate_hybrid_track(i, source_wav=source_wav)
        if os.path.exists(source_wav):
            os.remove(source_wav)
        print("🎉 Все 10 уникальных 20-секундных живых OGG эмбиентов собраны!")
