<?php
/**
 * Автоматическое обновление домена в sitemap.xml и HTML файлах
 * 
 * Этот скрипт автоматически:
 * 1. Определяет текущий домен сайта
 * 2. Добавляет домен в шапку всех HTML страниц (если его там нет)
 * 3. Обновляет существующие элементы домена в HTML файлах
 * 4. Обновляет домен в sitemap.xml
 * 5. Заменяет example.com в email адресах на реальный домен
 * 
 * Запустите этот скрипт один раз после размещения сайта на новом домене
 * После выполнения удалите этот файл с сервера
 */

// Определяем текущий домен
$protocol = isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] === 'on' ? 'https://' : 'http://';
$currentDomain = $protocol . $_SERVER['HTTP_HOST'];
$domainOnly = $_SERVER['HTTP_HOST']; // Только домен без протокола

echo "<h2>🔧 Автоматическая настройка домена</h2>";
echo "📍 Обнаружен домен: <strong>" . htmlspecialchars($currentDomain) . "</strong><br><br>";

$successCount = 0;
$errorCount = 0;

// Функция для обновления HTML файлов
function updateHtmlFiles($domainOnly, $currentDomain) {
    global $successCount, $errorCount;
    
    $htmlFiles = [
        'index.html',
        'merci.html', 
        'privacy-policy.html',
        'terms-of-service.html',
        'cookie-policy.html'
    ];
    
    $updatedFiles = [];
    
    foreach ($htmlFiles as $file) {
        if (file_exists($file)) {
            $content = file_get_contents($file);
            if ($content !== false) {
                $originalContent = $content;
                
                // Добавляем домен в шапку, если его там нет
                $headerPattern = '/(<div class="logo"[^>]*>.*?<\/div>)(\s*<\/div>)/s';
                if (preg_match($headerPattern, $content, $matches)) {
                    $logoDiv = $matches[1];
                    $closingDiv = $matches[2];
                    
                    // Проверяем, есть ли уже домен
                    if (!strpos($content, 'class="domain"')) {
                        $domainDiv = "\n          <div class=\"domain\" style=\"color: #2196f3; opacity: 0.8; font-size: 0.9rem; margin-top: 4px;\">{$domainOnly}</div>";
                        $content = str_replace($matches[0], $logoDiv . $domainDiv . $closingDiv, $content);
                    }
                }
                
                // Обновляем существующие элементы домена
                $content = preg_replace(
                    '/(<div class="domain"[^>]*>).*?(<\/div>)/s',
                    '$1' . $domainOnly . '$2',
                    $content
                );
                
                // Обновляем домен в контактах
                $content = preg_replace(
                    '/(<div class="contact-domain"[^>]*>).*?(<\/div>)/s',
                    '$1' . $domainOnly . '$2',
                    $content
                );
                
                // Обновляем домен в футере
                $content = preg_replace(
                    '/(<div class="footer-domain"[^>]*>).*?(<\/div>)/s',
                    '$1' . $domainOnly . '$2',
                    $content
                );
                
                // Обновляем email адреса с example.com
                $content = str_replace('@example.com', '@' . $domainOnly, $content);
                
                if ($content !== $originalContent) {
                    if (file_put_contents($file, $content) !== false) {
                        $updatedFiles[] = $file;
                        $successCount++;
                    } else {
                        $errorCount++;
                    }
                }
            } else {
                $errorCount++;
            }
        }
    }
    
    return $updatedFiles;
}

// Обновляем HTML файлы
echo "<h3>📄 Обновление HTML файлов:</h3>";
$updatedHtmlFiles = updateHtmlFiles($domainOnly, $currentDomain);

if (!empty($updatedHtmlFiles)) {
    echo "✅ Обновлены файлы: " . implode(', ', $updatedHtmlFiles) . "<br>";
} else {
    echo "ℹ️ HTML файлы не требуют обновления<br>";
}

// Обновляем sitemap.xml
echo "<br><h3>🗺️ Обновление sitemap.xml:</h3>";
$sitemapFile = 'sitemap.xml';

if (file_exists($sitemapFile)) {
    $sitemapContent = file_get_contents($sitemapFile);
    
    if ($sitemapContent !== false) {
        $updatedContent = str_replace('https://example.com', $currentDomain, $sitemapContent);
        $updatedContent = str_replace('http://example.com', $currentDomain, $updatedContent);
        
        // Обновляем дату последнего изменения
        $currentDate = date('c');
        $updatedContent = preg_replace(
            '/<lastmod>.*?<\/lastmod>/',
            '<lastmod>' . $currentDate . '</lastmod>',
            $updatedContent
        );
        
        if (file_put_contents($sitemapFile, $updatedContent) !== false) {
            echo "✅ sitemap.xml успешно обновлен<br>";
            $successCount++;
        } else {
            echo "❌ Ошибка при сохранении sitemap.xml<br>";
            $errorCount++;
        }
    } else {
        echo "❌ Не удалось прочитать sitemap.xml<br>";
        $errorCount++;
    }
} else {
    echo "⚠️ Файл sitemap.xml не найден<br>";
}

// Итоговый отчет
echo "<br><hr><h3>📊 Итоговый отчет:</h3>";
if ($successCount > 0) {
    echo "✅ <strong>Успешно обновлено файлов: {$successCount}</strong><br>";
}
if ($errorCount > 0) {
    echo "❌ <strong>Ошибок: {$errorCount}</strong><br>";
}

echo "<br>🎯 <strong>Что дальше:</strong><br>";
echo "1. Удалите этот файл (update-sitemap.php) с сервера<br>";
echo "2. Проверьте, что домен отображается в шапке сайта<br>";
echo "3. Загрузите обновленный sitemap.xml в Google Search Console<br>";
echo "4. Проверьте работоспособность всех страниц<br>";

if (file_exists($sitemapFile)) {
    echo "<br><hr><h3>📋 Превью обновленного sitemap.xml:</h3>";
    $sitemapContent = file_get_contents($sitemapFile);
    echo "<pre>" . htmlspecialchars(substr($sitemapContent, 0, 500)) . "...</pre>";
}
?>

<style>
body { 
    font-family: Arial, sans-serif; 
    max-width: 800px; 
    margin: 50px auto; 
    padding: 20px; 
    background: #f5f5f5; 
}
pre { 
    background: #fff; 
    padding: 15px; 
    border-radius: 5px; 
    overflow-x: auto; 
    border-left: 4px solid #007cba;
}
</style> 