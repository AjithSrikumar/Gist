$chapters = Get-Content 'D:\Projects\Book Summary\gist\src\data\books\principles-changing-world-order.chapters.json' -Raw | ConvertFrom-Json | Select-Object -ExpandProperty chapters
$totalWords = 0
foreach($chapter in $chapters) {
    $words = $chapter.summary -split '\s+' | Measure-Object | Select-Object -ExpandProperty Count
    $totalWords += $words
    Write-Host ('{0}: {1} words' -f $chapter.title, $words)
}
$average = $totalWords / $chapters.Count
Write-Host ('Total chapters: {0}' -f $chapters.Count)
Write-Host ('Average word count: {0:N0}' -f $average)
