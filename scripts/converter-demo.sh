#!/bin/bash
# Converte uma gravação de scripts/gravar-demo.cjs em MP4 (H.264), WebM (VP9) e capa WebP em public/videos/.
# uso: scripts/converter-demo.sh <nome-m|nome-d> <largura> [crf264] [crfvp9]
#   celular: largura 480   computador: largura 1280
set -e
FF=${FFMPEG:-ffmpeg}
N=$1; W=$2; C1=${3:-27}; C2=${4:-38}
DIR="${TMPDIR:-/tmp}/demo-frames/$N"
OUT="$(cd "$(dirname "$0")/.." && pwd)/public/videos"
VF="fps=30,scale=${W}:-2:flags=lanczos,format=yuv420p"
$FF -hide_banner -loglevel error -y -f concat -safe 0 -i "$DIR/list.txt" -vf "$VF" -c:v libx264 -preset slow -crf "$C1" -profile:v high -pix_fmt yuv420p -movflags +faststart -an "$OUT/$N.mp4"
$FF -hide_banner -loglevel error -y -f concat -safe 0 -i "$DIR/list.txt" -vf "$VF" -c:v libvpx-vp9 -b:v 0 -crf "$C2" -row-mt 1 -deadline good -cpu-used 2 -an "$OUT/$N.webm"
FIRST=$(ls "$DIR"/*.jpg | head -1)
$FF -hide_banner -loglevel error -y -i "$FIRST" -vf "scale=${W}:-2:flags=lanczos" -c:v libwebp -quality 78 "$OUT/$N.webp"
ls -la "$OUT/$N".*
