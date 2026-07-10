from fastapi import APIRouter

from app.api.v1.routes import legal, conversations, webhooks, admin

router = APIRouter()
router.include_router(legal.router, prefix="/legal", tags=["legal"])
router.include_router(conversations.router, prefix="/conversations", tags=["conversations"])
router.include_router(webhooks.router, prefix="/webhooks", tags=["webhooks"])
router.include_router(admin.router, prefix="/admin", tags=["admin"])
