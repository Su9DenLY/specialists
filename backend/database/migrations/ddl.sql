CREATE TABLE IF NOT EXISTS users (
    user_id UUID PRIMARY KEY,
    email VARCHAR NOT NULL,
    password_hash VARCHAR NOT NULL,
    role VARCHAR NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE users IS 'Информация о всех пользователях сервиса';
COMMENT ON COLUMN users.user_id IS 'Уникальный идентификатор пользователя';
COMMENT ON COLUMN users.email IS 'Электронная почта пользователя';
COMMENT ON COLUMN users.password_hash IS 'Хэш пароля';
COMMENT ON COLUMN users.role IS 'Роль пользователя(клиент, специалист, администратор';
COMMENT ON COLUMN users.created_at IS 'Время создания аккаунта';


CREATE TABLE IF NOT EXISTS customer_profiles (
     user_id UUID REFERENCES users(user_id) PRIMARY KEY,
     first_name VARCHAR NOT NULL,
     last_name VARCHAR NOT NULL,
     phone VARCHAR NOT NULL,
     birth_date TIMESTAMPTZ NOT NULL
);

COMMENT ON TABLE customer_profiles IS 'Информация о клиентах сервиса';
COMMENT ON COLUMN customer_profiles.user_id IS 'Уникальный идентификатор пользователя';
COMMENT ON COLUMN customer_profiles.first_name IS 'Имя клиента';
COMMENT ON COLUMN customer_profiles.last_name IS 'Фамилия клиента';
COMMENT ON COLUMN customer_profiles.phone IS 'Номер телефона клиента';
COMMENT ON COLUMN customer_profiles.birth_date IS 'День рождение клиента';


CREATE TABLE IF NOT EXISTS specialist_profiles (
    user_id UUID REFERENCES users(user_id) PRIMARY KEY,
    first_name VARCHAR NOT NULL,
    last_name VARCHAR NOT NULL,
    phone VARCHAR NOT NULL,
    birth_date TIMESTAMPTZ NOT NULL,
    experience DECIMAL(4, 2),
    rating DECIMAL(3, 2),
    description TEXT
);

COMMENT ON TABLE specialist_profiles IS 'Информация о специалистах сервиса';
COMMENT ON COLUMN specialist_profiles.user_id IS 'Уникальный идентификатор пользователя';
COMMENT ON COLUMN specialist_profiles.first_name IS 'Имя специалиста';
COMMENT ON COLUMN specialist_profiles.last_name IS 'Фамилия специалиста';
COMMENT ON COLUMN specialist_profiles.phone IS 'Номер телефона специалиста';
COMMENT ON COLUMN specialist_profiles.birth_date IS 'День рождение специалиста';
COMMENT ON COLUMN specialist_profiles.experience IS 'Опыт работы специалиста';
COMMENT ON COLUMN specialist_profiles.rating IS 'Рейтинг специалиста';
COMMENT ON COLUMN specialist_profiles.description IS 'Описание специалиста';


CREATE TABLE IF NOT EXISTS specialties (
    specialty_id UUID PRIMARY KEY,    
    title VARCHAR NOT NULL
);

COMMENT ON TABLE specialties IS 'Информация о специальностях';
COMMENT ON COLUMN specialties.specialty_id IS 'Уникальный идентификатор специальности';
COMMENT ON COLUMN specialties.title IS 'Название специальности';


CREATE TABLE IF NOT EXISTS specialist_specialties (
    specialist_id UUID REFERENCES specialist_profiles(user_id) ON DELETE CASCADE,
    specialty_id UUID REFERENCES specialties(specialty_id) ON DELETE CASCADE,
    PRIMARY KEY (specialist_id, specialty_id)
);

COMMENT ON TABLE specialist_specialties IS 'Связь между специалистами и их специальностями';
COMMENT ON COLUMN specialist_specialties.specialist_id IS 'Уникальный идентификатор специалиста';
COMMENT ON COLUMN specialist_specialties.specialty_id IS 'Уникальный идентификатор специальности';


CREATE TABLE IF NOT EXISTS orders (
    order_id UUID PRIMARY KEY,
    customer_id UUID REFERENCES customer_profiles(user_id) ON DELETE CASCADE,
    specialist_id UUID REFERENCES specialist_profiles(user_id) ON DELETE CASCADE,
    address TEXT NOT NULL,
    scheduled_time TIMESTAMPTZ NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'created',
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

COMMENT ON TABLE orders IS 'Информация о заказах';
COMMENT ON COLUMN orders.order_id IS 'Уникальный идентификатор заказа';
COMMENT ON COLUMN orders.customer_id IS 'Идентификатор клиента, сделавшего заказ';
COMMENT ON COLUMN orders.specialist_id IS 'Идентификатор специалиста, назначенного на заказ';
COMMENT ON COLUMN orders.address IS 'Адрес выполнения заказа';
COMMENT ON COLUMN orders.scheduled_time IS 'Запланированное время выполнения';
COMMENT ON COLUMN orders.price IS 'Стоимость заказа';
COMMENT ON COLUMN orders.status IS 'Статус заказа(created, completed, cancelled)';
COMMENT ON COLUMN orders.description IS 'Описание заказа';
COMMENT ON COLUMN orders.created_at IS 'Дата создания заказа';
COMMENT ON COLUMN orders.updated_at IS 'Дата последнего обновления заказа';



CREATE TABLE IF NOT EXISTS reviews (
    review_id UUID PRIMARY KEY,
    specialist_id UUID REFERENCES specialist_profiles(user_id) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    text TEXT NOT NULL
);

COMMENT ON TABLE reviews IS 'Таблица с отзывами';
COMMENT ON COLUMN reviews.review_id IS 'Уникальный идентификатор отзыва';
COMMENT ON COLUMN reviews.specialist_id IS 'Идентификатор специалиста, о котором написан отзыв';
COMMENT ON COLUMN reviews.created_at IS 'Время создания отзыва';
COMMENT ON COLUMN reviews.text IS 'Текст отзыва';


CREATE TABLE IF NOT EXISTS complaints (
    complaint_id UUID PRIMARY KEY,
    order_id UUID REFERENCES orders(order_id) ON DELETE CASCADE,
    customer_id UUID REFERENCES customer_profiles(user_id),
    specialist_id UUID REFERENCES specialist_profiles(user_id),
    description TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

COMMENT ON TABLE complaints IS 'Таблица жалоб клиентов';
COMMENT ON COLUMN complaints.complaint_id IS 'Уникальный идентификатор жалобы';
COMMENT ON COLUMN complaints.order_id IS 'Идентификатор связанного заказа';
COMMENT ON COLUMN complaints.customer_id IS 'Идентификатор клиента, подавшего жалобу';
COMMENT ON COLUMN complaints.specialist_id IS 'Идентификатор специалиста, на которого подана жалоба';
COMMENT ON COLUMN complaints.description IS 'Описание жалобы';
COMMENT ON COLUMN complaints.created_at IS 'Дата подачи жалобы';
        
        
CREATE TABLE IF NOT EXISTS questions (
    question_id UUID PRIMARY KEY,
    user_email VARCHAR NOT NULL,
    topic VARCHAR NOT NULL,
    description TEXT
);

COMMENT ON TABLE questions IS 'Таблица с вопросами или предложениями клиентов';
COMMENT ON COLUMN questions.question_id IS 'Уникальный идентификатор вопроса';
COMMENT ON COLUMN questions.user_email IS 'Почта клиента для обратной связи';
COMMENT ON COLUMN questions.topic IS 'Тема вопроса';
COMMENT ON COLUMN questions.description IS 'Описание вопроса';

        
CREATE OR REPLACE FUNCTION update_order_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
RETURN NEW;
END;
$$ LANGUAGE plpgsql;

COMMENT ON FUNCTION update_order_updated_at IS 'Обновляет время обновления заказа';

        
CREATE TRIGGER set_order_updated_at
BEFORE UPDATE ON orders
FOR EACH ROW
EXECUTE FUNCTION update_order_updated_at();

COMMENT ON TRIGGER set_order_updated_at ON orders IS 'Обновляет поле updated_at при изменении строки';
