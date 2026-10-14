Add-Type -AssemblyName System.Drawing
$root = $PSScriptRoot
$dest = Join-Path $root 'assets'
New-Item -ItemType Directory -Force -Path $dest | Out-Null
$items = @(
  # O quarto valor ($true) aplica o ajuste de cor das fotos da Helena.
  @('Fotos Helena - Perfil\Fotos Helena (1).jpg', 'helena-retrato.jpg', 1050, $true),
  @('Fotos Helena - Perfil\Fotos Helena (5).jpg', 'helena-consultorio.jpg', 1000, $true),
  @('movimentos-detalhes\Movimentos Bowen (1).jpg', 'bowen-maos.jpg', 1100),
  @('movimentos-detalhes\Movimentos Bowen (2).jpg', 'bowen-detalhe.jpg', 1100),
  @('novas-fotos\dor 1.png', 'corpo-dor-ombro.jpg', 1536),
  @('novas-fotos\academia feliz.png', 'vida-academia.jpg', 1536),
  @('novas-fotos\bike feliz.png', 'vida-bike.jpg', 1536),
  @('novas-fotos\corrida feliz.png', 'vida-corrida.jpg', 1536)
)
# Ajuste de cor: +5% de brilho e +10% de saturação.
function New-ColorAttributes([double]$brightness = 1.05, [double]$saturation = 1.1) {
  $lum = @(0.3086, 0.6094, 0.0820)
  $rows = @()
  for ($i = 0; $i -lt 3; $i++) {
    $row = [single[]](0,0,0,0,0)
    for ($j = 0; $j -lt 3; $j++) { $row[$j] = [single](((1 - $saturation) * $lum[$i] + $(if ($i -eq $j) { $saturation } else { 0 })) * $brightness) }
    $rows += ,$row
  }
  $rows += ,([single[]](0,0,0,1,0)); $rows += ,([single[]](0,0,0,0,1))
  $attributes = New-Object System.Drawing.Imaging.ImageAttributes
  $attributes.SetColorMatrix((New-Object System.Drawing.Imaging.ColorMatrix(,$rows)))
  return $attributes
}
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
  if ($item[3]) {
    $graphics.DrawImage($source, (New-Object System.Drawing.Rectangle(0, 0, $width, $height)), 0, 0, $source.Width, $source.Height, [System.Drawing.GraphicsUnit]::Pixel, (New-ColorAttributes))
  } else {
    $graphics.DrawImage($source, 0, 0, $width, $height)
  }
  $bitmap.Save((Join-Path $dest $item[1]), $encoder, $parameters)
  $graphics.Dispose(); $bitmap.Dispose(); $source.Dispose()
}
# Etapas do atendimento: recorte 4:5 (largura máxima 1200), com foco vertical em fração da altura.
$steps = @(
  @('novas-fotos\sequencia\1.png', 'passo-01.jpg', 0.5),
  @('novas-fotos\sequencia\2.png', 'passo-02.jpg', 0.5),
  @('novas-fotos\sequencia\3.png', 'passo-03.jpg', 0.5),
  @('novas-fotos\sequencia\4.png', 'passo-04.jpg', 0.48),
  @('novas-fotos\sequencia\5.png', 'passo-05.jpg', 0.5)
)
foreach ($step in $steps) {
  $source = [System.Drawing.Image]::FromFile((Join-Path $root $step[0]))
  $cropWidth = [Math]::Min($source.Width, [int]($source.Height * 4 / 5))
  $cropHeight = [int]($cropWidth * 5 / 4)
  $x = [int](($source.Width - $cropWidth) / 2)
  $y = [int][Math]::Min([Math]::Max($source.Height * $step[2] - $cropHeight / 2, 0), $source.Height - $cropHeight)
  $width = [Math]::Min(1200, $cropWidth)
  $height = [int]($width * 5 / 4)
  $bitmap = New-Object System.Drawing.Bitmap($width, $height)
  $graphics = [System.Drawing.Graphics]::FromImage($bitmap)
  $graphics.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
  $graphics.DrawImage($source, (New-Object System.Drawing.Rectangle(0, 0, $width, $height)), (New-Object System.Drawing.Rectangle($x, $y, $cropWidth, $cropHeight)), [System.Drawing.GraphicsUnit]::Pixel)
  $bitmap.Save((Join-Path $dest $step[1]), $encoder, $parameters)
  $graphics.Dispose(); $bitmap.Dispose(); $source.Dispose()
}
$source = [System.Drawing.Image]::FromFile((Join-Path $root 'logo.jpeg.jpg'))
$crop = New-Object System.Drawing.Bitmap(550, 230)
$g = [System.Drawing.Graphics]::FromImage($crop)
$g.DrawImage($source, (New-Object System.Drawing.Rectangle(0,0,550,230)), (New-Object System.Drawing.Rectangle(260,205,550,230)), [System.Drawing.GraphicsUnit]::Pixel)
$crop.Save((Join-Path $dest 'helena-logo.png'), [System.Drawing.Imaging.ImageFormat]::Png)
$g.Dispose(); $crop.Dispose(); $source.Dispose()
