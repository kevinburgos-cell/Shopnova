#!/bin/bash
set -e

IMAGE=$1
TAG=$2

if [ -z "$IMAGE" ] || [ -z "$TAG" ]; then
  echo "Uso: ./deploy.sh <imagen> <tag>"
  echo "Ejemplo: ./deploy.sh ghcr.io/kevinburgos-cell/shopnova-backend latest"
  exit 1
fi

echo "=========================================="
echo "  ShopNova Blue-Green Deployment"
echo "  Imagen: $IMAGE:$TAG"
echo "=========================================="

echo "[1/6] Descargando imagen nueva..."
docker pull $IMAGE:$TAG

echo "[2/6] Detectando slot activo..."
if docker ps --format '{{.Names}}' | grep -q "shopnova-blue"; then
  ACTIVE="blue"
  INACTIVE="green"
  ACTIVE_PORT=3001
  INACTIVE_PORT=3002
else
  ACTIVE="green"
  INACTIVE="blue"
  ACTIVE_PORT=3002
  INACTIVE_PORT=3001
fi

echo "  Slot activo: $ACTIVE (puerto $ACTIVE_PORT)"
echo "  Slot nuevo:  $INACTIVE (puerto $INACTIVE_PORT)"

echo "[3/6] Iniciando nuevo slot $INACTIVE..."
docker stop shopnova-$INACTIVE 2>/dev/null || true
docker rm shopnova-$INACTIVE 2>/dev/null || true

docker run -d \
  --name shopnova-$INACTIVE \
  --restart unless-stopped \
  -p $INACTIVE_PORT:3001 \
  -e NODE_ENV=production \
  -e PORT=3001 \
  -e SLOT=$INACTIVE \
  -e APP_VERSION=$TAG \
  $IMAGE:$TAG

echo "[4/6] Verificando salud del nuevo slot..."
MAX_RETRIES=12
COUNT=0
until curl -sf http://localhost:$INACTIVE_PORT/api/health > /dev/null 2>&1; do
  COUNT=$((COUNT + 1))
  if [ $COUNT -ge $MAX_RETRIES ]; then
    echo "ERROR: El nuevo slot no respondio a tiempo. Rollback automatico."
    docker stop shopnova-$INACTIVE 2>/dev/null || true
    docker rm shopnova-$INACTIVE 2>/dev/null || true
    exit 1
  fi
  echo "  Esperando... intento $COUNT/$MAX_RETRIES"
  sleep 5
done

echo "  Nuevo slot saludable en puerto $INACTIVE_PORT"

echo "[5/6] Cambiando trafico al nuevo slot $INACTIVE..."
sudo iptables -t nat -F PREROUTING 2>/dev/null || true
if [ "$INACTIVE_PORT" = "3002" ]; then
  sudo iptables -t nat -A PREROUTING -p tcp --dport 80 -j REDIRECT --to-port 3002 2>/dev/null || true
else
  sudo iptables -t nat -A PREROUTING -p tcp --dport 80 -j REDIRECT --to-port 3001 2>/dev/null || true
fi

echo "[6/6] Deteniendo slot anterior $ACTIVE..."
sleep 5
docker stop shopnova-$ACTIVE 2>/dev/null || true
docker rm shopnova-$ACTIVE 2>/dev/null || true

echo ""
echo "=========================================="
echo "  Deploy completado exitosamente"
echo "  Version: $TAG"
echo "  Slot activo: $INACTIVE"
echo "  Puerto: $INACTIVE_PORT"
echo "=========================================="

curl -s http://localhost:$INACTIVE_PORT/api/health | python3 -m json.tool 2>/dev/null || true
