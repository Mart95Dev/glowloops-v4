$files = Get-Content -Path "modified_files.txt"
foreach ($file in $files) {
    if ($file -ne "src/lib/firebase/firebase-adminsdk.json") {
        Write-Host "Copying $file"
        git checkout ticket004 -- "$file"
    }
}
