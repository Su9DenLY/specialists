from typing import List, Dict
from uuid import UUID

import asyncpg


class QuestionRepository:
    def __init__(self, connection: asyncpg.Connection):
        self.connection = connection

    async def create_question(self, question_id: UUID, user_email: str, topic: str, description: str) -> None:
        query = """
        INSERT INTO questions (question_id, user_email, topic, description)
        VALUES ($1, $2, $3, $4);
        """
        await self.connection.execute(query, question_id, user_email, topic, description)

    async def get_all_questions(self) -> List[Dict]:
        query = """
        SELECT question_id, user_email, topic, description
        FROM questions
        """
        questions = await self.connection.fetch(query)
        return [dict(question) for question in questions]
