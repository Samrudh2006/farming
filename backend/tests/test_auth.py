"""
Tests for the health check & auth endpoints.
"""
import pytest
from httpx import AsyncClient


@pytest.mark.asyncio
async def test_health_check(client: AsyncClient):
    """Health endpoint should return 200."""
    response = await client.get("/api/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "healthy"
    assert data["service"] == "ISIN API"


@pytest.mark.asyncio
async def test_register_user(client: AsyncClient):
    """Register a new candidate."""
    response = await client.post(
        "/api/auth/register",
        json={
            "email": "test@example.com",
            "password": "testpassword123",
            "full_name": "Test User",
            "college": "IIT Bombay",
        },
    )
    assert response.status_code == 200
    data = response.json()
    assert "access_token" in data
    assert data["user"]["email"] == "test@example.com"
    assert data["user"]["role"] == "candidate"


@pytest.mark.asyncio
async def test_register_duplicate_email(client: AsyncClient):
    """Duplicate email should return 400."""
    payload = {
        "email": "dupe@example.com",
        "password": "testpassword123",
        "full_name": "User One",
    }
    await client.post("/api/auth/register", json=payload)
    response = await client.post("/api/auth/register", json=payload)
    assert response.status_code == 400


@pytest.mark.asyncio
async def test_login_success(client: AsyncClient):
    """Login with correct credentials."""
    # Register first
    await client.post(
        "/api/auth/register",
        json={
            "email": "login@example.com",
            "password": "mypassword123",
            "full_name": "Login User",
        },
    )
    # Login
    response = await client.post(
        "/api/auth/login",
        json={"email": "login@example.com", "password": "mypassword123"},
    )
    assert response.status_code == 200
    assert "access_token" in response.json()


@pytest.mark.asyncio
async def test_login_wrong_password(client: AsyncClient):
    """Login with wrong password should return 401."""
    await client.post(
        "/api/auth/register",
        json={
            "email": "wrong@example.com",
            "password": "correct_password",
            "full_name": "Wrong Pass",
        },
    )
    response = await client.post(
        "/api/auth/login",
        json={"email": "wrong@example.com", "password": "incorrect_password"},
    )
    assert response.status_code == 401


@pytest.mark.asyncio
async def test_get_profile_unauthenticated(client: AsyncClient):
    """Profile without token should return 403."""
    response = await client.get("/api/auth/me")
    assert response.status_code == 403


@pytest.mark.asyncio
async def test_get_profile_authenticated(client: AsyncClient):
    """Profile with valid token should return user data."""
    # Register
    reg = await client.post(
        "/api/auth/register",
        json={
            "email": "profile@example.com",
            "password": "profilepass123",
            "full_name": "Profile User",
        },
    )
    token = reg.json()["access_token"]

    # Get profile
    response = await client.get(
        "/api/auth/me",
        headers={"Authorization": f"Bearer {token}"},
    )
    assert response.status_code == 200
    assert response.json()["email"] == "profile@example.com"
