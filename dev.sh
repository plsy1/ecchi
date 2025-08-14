#!/bin/bash

# 激活 Python 虚拟环境
echo "Activating Python virtual environment..."
source ./venv/bin/activate

# 后端启动
echo "Starting backend..."
PYTHONPATH=$(pwd)/backend uvicorn backend.main:App --host 0.0.0.0 --port 8964 --reload &
BACKEND_PID=$!
echo "Backend PID: $BACKEND_PID"

# 前端启动
echo "Starting frontend..."
cd frontend
ng serve --host 0.0.0.0 &
FRONTEND_PID=$!
echo "Frontend PID: $FRONTEND_PID"

# 回到根目录
cd ..

# 等待后台进程
echo "Press Ctrl+C to stop both frontend and backend..."
trap "echo 'Stopping...'; kill $BACKEND_PID $FRONTEND_PID; exit 0" SIGINT

# 等待所有子进程
wait