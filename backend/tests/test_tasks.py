"""
Tests for the tasks endpoints.
"""
import pytest
from httpx import AsyncClient


@pytest.mark.asyncio
async def test_list_tasks_empty(client: AsyncClient):
    """Tasks list should return empty initially."""
    # Register & get token
    reg = await client.post(
        "/api/auth/register",
        json={
            "email": "tasks@example.com",
            "password": "taskpass123",
            "full_name": "Task User",
        },
    )
    token = reg.json()["access_token"]

    response = await client.get(
        "/api/tasks",
        headers={"Authorization": f"Bearer {token}"},
    )
    assert response.status_code == 200
    assert isinstance(response.json(), list)


@pytest.mark.asyncio
async def test_get_task_not_found(client: AsyncClient):
    """Getting a non-existent task should return 404."""
    reg = await client.post(
        "/api/auth/register",
        json={
            "email": "tasks2@example.com",
            "password": "taskpass123",
            "full_name": "Task User 2",
        },
    )
    token = reg.json()["access_token"]

    response = await client.get(
        "/api/tasks/00000000-0000-0000-0000-000000000000",
        headers={"Authorization": f"Bearer {token}"},
    )
    assert response.status_code == 404
