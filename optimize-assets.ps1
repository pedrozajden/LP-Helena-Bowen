Add-Type -AssemblyName System.Drawing
$root = $PSScriptRoot
$dest = Join-Path $root 'assets'
New-Item -ItemType Directory -Force -Path $dest | Out-Null
$items = @(
  @('Fotos Helena - Perfil\Fotos Helena (1).jpg', 'helena-retrato.jpg', 1050),
  @('Fotos Helena - Perfil\Fotos Helena (5).jpg', 'helena-consultorio.jpg', 1000),
  @('movimentos-detalhes\Movimentos Bowen (1).jpg', 'bowen-maos.jpg', 1100),
  @('movimentos-detalhes\Movimentos Bowen (2).jpg', 'bowen-detalhe.jpg', 1100)
)
$encoder = [System.Drawing.Imaging.ImageCodecInfo]::GetImageEncoders() | Where-Object MimeType -eq 'image/jpeg'
$parameters = New-Object System.Drawing.Imaging.EncoderParameters(1)
$parameters.Param[0] = New-Object System.Drawing.Imaging.EncoderParameter([System.Drawing.Imaging.Encoder]::Quality, [long]82)
foreach ($item in $items) {
  $source = [System.Drawing.Image]::FromFile((Join-Path $root $item[0]))
  if ($source.PropertyIdList -contains 274) {
    $orientation = $source.GetPropertyItem(274).Value[0]
    if ($orientation -eq 6) { $source.RotateFlip([System.Drawing.RotateFlipType]::Rotate90FlipNone) }
    if ($orientation -eq 8) { $source.RotateFlip([System.Drawing.RotateFlipType]::Rotate270FlipNone) }
    if ($orientation -eq 3) { $source.RotateFlip([System.Drawing.RotateFlipType]::Rotate180FlipNone) }
  }
  $width = [Math]::Min($item[2], $source.Width)
  $height = [int]($source.Height * $width / $source.Width)
  $bitmap = New-Object System.Drawing.Bitmap($width, $height)
  $graphics = [System.Drawing.Graphics]::FromImage($bitmap)
  $graphics.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
  $graphics.DrawImage($source, 0, 0, $width, $height)
  $bitmap.Save((Join-Path $dest $item[1]), $encoder, $parameters)
  $graphics.Dispose(); $bitmap.Dispose(); $source.Dispose()
}
$source = [System.Drawing.Image]::FromFile((Join-Path $root 'logo.jpeg.jpg'))
$crop = New-Object System.Drawing.Bitmap(550, 230)
$g = [System.Drawing.Graphics]::FromImage($crop)
$g.DrawImage($source, (New-Object System.Drawing.Rectangle(0,0,550,230)), (New-Object System.Drawing.Rectangle(260,205,550,230)), [System.Drawing.GraphicsUnit]::Pixel)
$crop.Save((Join-Path $dest 'helena-logo.png'), [System.Drawing.Imaging.ImageFormat]::Png)
$g.Dispose(); $crop.Dispose(); $source.Dispose()
