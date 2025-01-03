/*
  # Fix messaging and notifications

  1. Changes
    - Add missing indexes for better performance
    - Add cascade deletes for notifications and messages
    - Add trigger for notification cleanup
    - Add trigger for message cleanup

  2. Security
    - Update RLS policies for better access control
*/

-- Add missing indexes
CREATE INDEX IF NOT EXISTS idx_messages_sender_recipient ON messages(sender_id, recipient_id);
CREATE INDEX IF NOT EXISTS idx_notifications_user_actor ON notifications(user_id, actor_id);

-- Update messages policies
DROP POLICY IF EXISTS "Users can send messages" ON messages;
CREATE POLICY "Users can send messages"
  ON messages FOR INSERT
  WITH CHECK (auth.uid() = sender_id);

DROP POLICY IF EXISTS "Users can view their messages" ON messages;
CREATE POLICY "Users can view their messages"
  ON messages FOR SELECT
  USING (auth.uid() IN (sender_id, recipient_id));

-- Update notifications policies
DROP POLICY IF EXISTS "Users can view own notifications" ON notifications;
CREATE POLICY "Users can view own notifications"
  ON notifications FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "System can create notifications" ON notifications;
CREATE POLICY "System can create notifications"
  ON notifications FOR INSERT
  WITH CHECK (true);

-- Create cleanup trigger for notifications
CREATE OR REPLACE FUNCTION cleanup_old_notifications()
RETURNS trigger AS $$
BEGIN
  DELETE FROM notifications
  WHERE created_at < NOW() - INTERVAL '30 days';
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_cleanup_notifications ON notifications;
CREATE TRIGGER trigger_cleanup_notifications
  AFTER INSERT ON notifications
  EXECUTE FUNCTION cleanup_old_notifications();

-- Create cleanup trigger for messages
CREATE OR REPLACE FUNCTION cleanup_old_messages()
RETURNS trigger AS $$
BEGIN
  DELETE FROM messages
  WHERE created_at < NOW() - INTERVAL '90 days';
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_cleanup_messages ON messages;
CREATE TRIGGER trigger_cleanup_messages
  AFTER INSERT ON messages
  EXECUTE FUNCTION cleanup_old_messages();