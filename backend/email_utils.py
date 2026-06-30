import smtplib
import os
from email.message import EmailMessage
from dotenv import load_dotenv

load_dotenv()

EMAIL_REMETENTE = os.getenv("EMAIL_REMETENTE")
SENHA_REMETENTE = os.getenv("SENHA_REMETENTE")

def enviar_email_boas_vindas(email_destino: str, nome_cliente: str):
    if not EMAIL_REMETENTE or not SENHA_REMETENTE:
        print("Aviso: Credenciais de e-mail não configuradas no .env!")
        return

    msg = EmailMessage()
    msg['Subject'] = 'Bem-vindo à Kaibamen Shop!'
    msg['From'] = EMAIL_REMETENTE
    msg['To'] = email_destino
    
    conteudo = f"""Olá, {nome_cliente}!
Seja muito bem-vindo à Kaibamen Shop!
Estamos muito felizes em tê-lo conosco! 

Sua conta foi criada com sucesso.

Agora voçê pode preparar o seu melhor deck, porque o nosso estoque de cartas Yu-Gi-Oh! já está disponível para você.

Boas compras e bons duelos!

Atenciosamente,
Equipe Kaiba Corp."""
    
    msg.set_content(conteudo)

    try:
        with smtplib.SMTP('smtp.gmail.com', 587) as smtp:
            smtp.starttls()
            smtp.login(EMAIL_REMETENTE, SENHA_REMETENTE)
            smtp.send_message(msg)
            print("E-mail enviado com sucesso!")
    except Exception as erro:
        print(f"Erro CRÍTICO ao enviar e-mail: {erro}")