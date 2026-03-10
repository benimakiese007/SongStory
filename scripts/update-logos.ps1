# Script to replace text-based SONGSTORY. logos with the new image logo
# across all HTML files in the SongStory project

$projectRoot = "C:\Users\tmaut\Downloads\THE PHOENIX\SongStory"

# ============================================================
# 1. ROOT-LEVEL PAGES (index.html, about.html, etc.)
# ============================================================
$rootPages = @(
    "index.html",
    "about.html",
    "account.html",
    "contribute.html",
    "glossary.html",
    "single-song.html",
    "timeline.html",
    "admin.html"
)

foreach ($page in $rootPages) {
    $filePath = Join-Path $projectRoot $page
    if (Test-Path $filePath) {
        $content = Get-Content $filePath -Raw -Encoding UTF8

        # Replace nav text logo (span or a tag containing SONGSTORY.)
        # Pattern 1: <span ...>SONGSTORY.</span> (index.html)
        $content = $content -replace '<span class="text-white text-lg font-medium tracking-tighter">SONGSTORY\.</span>',
            '<a href="index.html" class="flex items-center gap-2"><img src="Images/Logo/Song Story Logo png.png" alt="SongStory Logo" class="h-8 w-auto"><span class="sr-only">SONGSTORY</span></a>'

        # Pattern 2: <a href="index.html" ...>SONGSTORY.</a>
        $content = $content -replace '<a href="index\.html" class="text-white text-lg font-medium tracking-tighter">SONGSTORY\.</a>',
            '<a href="index.html" class="flex items-center gap-2"><img src="Images/Logo/Song Story Logo png.png" alt="SongStory Logo" class="h-8 w-auto"><span class="sr-only">SONGSTORY</span></a>'

        # Replace footer text logo
        $content = $content -replace '<span class="text-white text-xl font-medium tracking-tighter block mb-4">SONGSTORY\.</span>',
            '<a href="index.html" class="flex items-center gap-2 mb-4"><img src="Images/Logo/Song Story Logo png.png" alt="SongStory Logo" class="h-10 w-auto"><span class="sr-only">SONGSTORY</span></a>'

        # Update favicon/apple-touch-icon references to use the new logo
        $content = $content -replace 'href="icons/apple-touch-icon\.png"', 'href="Images/Logo/Song Story Logo png.png"'
        $content = $content -replace 'href="icons/favicon-32x32\.png"', 'href="Images/Logo/Song Story Logo png.png"'
        $content = $content -replace 'href="icons/favicon-16x16\.png"', 'href="Images/Logo/Song Story Logo png.png"'

        Set-Content $filePath $content -Encoding UTF8 -NoNewline
        Write-Host "Updated: $page"
    } else {
        Write-Host "SKIP (not found): $page"
    }
}

# ============================================================
# 2. ARTIST PAGES (artists/*.html)
# ============================================================
$artistPages = Get-ChildItem -Path (Join-Path $projectRoot "artists") -Filter "*.html" -ErrorAction SilentlyContinue

foreach ($file in $artistPages) {
    $content = Get-Content $file.FullName -Raw -Encoding UTF8

    # Replace nav text logo
    $content = $content -replace '<a href="\.\./index\.html" class="text-white text-lg font-medium tracking-tighter">SONGSTORY\.</a>',
        '<a href="../index.html" class="flex items-center gap-2"><img src="../Images/Logo/Song Story Logo png.png" alt="SongStory Logo" class="h-8 w-auto"><span class="sr-only">SONGSTORY</span></a>'

    # Update favicon references
    $content = $content -replace 'href="\.\./icons/apple-touch-icon\.png"', 'href="../Images/Logo/Song Story Logo png.png"'
    $content = $content -replace 'href="\.\./icons/favicon-32x32\.png"', 'href="../Images/Logo/Song Story Logo png.png"'
    $content = $content -replace 'href="\.\./icons/favicon-16x16\.png"', 'href="../Images/Logo/Song Story Logo png.png"'
    $content = $content -replace "href=""icons/apple-touch-icon\.png""", 'href="../Images/Logo/Song Story Logo png.png"'
    $content = $content -replace "href=""icons/favicon-32x32\.png""", 'href="../Images/Logo/Song Story Logo png.png"'
    $content = $content -replace "href=""icons/favicon-16x16\.png""", 'href="../Images/Logo/Song Story Logo png.png"'

    Set-Content $file.FullName $content -Encoding UTF8 -NoNewline
    Write-Host "Updated: artists/$($file.Name)"
}

# ============================================================
# 3. SONG PAGES (songs/*/*.html)
# ============================================================
$songPages = Get-ChildItem -Path (Join-Path $projectRoot "songs") -Filter "*.html" -Recurse -ErrorAction SilentlyContinue

foreach ($file in $songPages) {
    $content = Get-Content $file.FullName -Raw -Encoding UTF8

    # Replace nav text logo
    $content = $content -replace '<a href="\.\.\/\.\.\/index\.html" class="text-white text-lg font-medium tracking-tighter">SONGSTORY\.</a>',
        '<a href="../../index.html" class="flex items-center gap-2"><img src="../../Images/Logo/Song Story Logo png.png" alt="SongStory Logo" class="h-8 w-auto"><span class="sr-only">SONGSTORY</span></a>'

    # Update favicon references
    $content = $content -replace 'href="\.\.\/\.\.\/icons/apple-touch-icon\.png"', 'href="../../Images/Logo/Song Story Logo png.png"'
    $content = $content -replace 'href="\.\.\/\.\.\/icons/favicon-32x32\.png"', 'href="../../Images/Logo/Song Story Logo png.png"'
    $content = $content -replace 'href="\.\.\/\.\.\/icons/favicon-16x16\.png"', 'href="../../Images/Logo/Song Story Logo png.png"'
    $content = $content -replace "href=""icons/apple-touch-icon\.png""", 'href="../../Images/Logo/Song Story Logo png.png"'
    $content = $content -replace "href=""icons/favicon-32x32\.png""", 'href="../../Images/Logo/Song Story Logo png.png"'
    $content = $content -replace "href=""icons/favicon-16x16\.png""", 'href="../../Images/Logo/Song Story Logo png.png"'

    Set-Content $file.FullName $content -Encoding UTF8 -NoNewline
    Write-Host "Updated: songs/$($file.Directory.Name)/$($file.Name)"
}

# ============================================================
# 4. COPY LOGO FOR PWA ICONS
# ============================================================
$logoSrc = Join-Path $projectRoot "Images\Logo\Song Story Logo png.png"
$iconsDir = Join-Path $projectRoot "icons"

Copy-Item $logoSrc (Join-Path $iconsDir "icon-192.png") -Force
Copy-Item $logoSrc (Join-Path $iconsDir "icon-512.png") -Force
Copy-Item $logoSrc (Join-Path $iconsDir "apple-touch-icon.png") -Force
Copy-Item $logoSrc (Join-Path $iconsDir "favicon-32x32.png") -Force
Copy-Item $logoSrc (Join-Path $iconsDir "favicon-16x16.png") -Force

Write-Host ""
Write-Host "=== PWA icons updated ==="
Write-Host "Done! All logos have been updated."
