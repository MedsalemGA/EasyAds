<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Code de vérification</title>
    <style>
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            margin: 0;
            padding: 40px 20px;
        }
        .container {
            max-width: 600px;
            margin: 0 auto;
            background: white;
            border-radius: 20px;
            overflow: hidden;
            box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
        }
        .header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            padding: 40px 30px;
            text-align: center;
            color: white;
        }
        .header h1 {
            margin: 0;
            font-size: 32px;
            font-weight: bold;
        }
        .header p {
            margin: 10px 0 0;
            font-size: 16px;
            opacity: 0.9;
        }
        .content {
            padding: 40px 30px;
        }
        .greeting {
            font-size: 18px;
            color: #333;
            margin-bottom: 20px;
        }
        .message {
            font-size: 16px;
            color: #666;
            line-height: 1.6;
            margin-bottom: 30px;
        }
        .code-container {
            background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
            border-radius: 15px;
            padding: 30px;
            text-align: center;
            margin: 30px 0;
            border: 3px dashed #667eea;
        }
        .code-label {
            font-size: 14px;
            color: #666;
            text-transform: uppercase;
            letter-spacing: 1px;
            margin-bottom: 10px;
        }
        .code {
            font-size: 48px;
            font-weight: bold;
            color: #667eea;
            letter-spacing: 8px;
            font-family: 'Courier New', monospace;
            margin: 10px 0;
        }
        .expiry {
            font-size: 14px;
            color: #999;
            margin-top: 15px;
        }
        .warning {
            background: #fff3cd;
            border-left: 4px solid #ffc107;
            padding: 15px;
            margin: 20px 0;
            border-radius: 5px;
        }
        .warning p {
            margin: 0;
            color: #856404;
            font-size: 14px;
        }
        .footer {
            background: #f8f9fa;
            padding: 30px;
            text-align: center;
            border-top: 1px solid #e9ecef;
        }
        .footer p {
            margin: 5px 0;
            color: #6c757d;
            font-size: 14px;
        }
        .footer a {
            color: #667eea;
            text-decoration: none;
        }
        .social-links {
            margin-top: 20px;
        }
        .social-links a {
            display: inline-block;
            margin: 0 10px;
            color: #667eea;
            text-decoration: none;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🎯 EasyAds</h1>
            <p>Vérification de votre compte</p>
        </div>
        
        <div class="content">
            <div class="greeting">
                Bonjour {{ $userName }},
            </div>
            
            <div class="message">
                <p>Merci de vous être inscrit sur <strong>EasyAds</strong> ! Pour finaliser la création de votre compte, veuillez utiliser le code de vérification ci-dessous :</p>
            </div>
            
            <div class="code-container">
                <div class="code-label">Votre code de vérification</div>
                <div class="code">{{ $code }}</div>
                <div class="expiry">⏱️ Ce code expire dans 15 minutes</div>
            </div>
            
            <div class="warning">
                <p><strong>⚠️ Important :</strong> Si vous n'avez pas demandé ce code, veuillez ignorer cet email. Ne partagez jamais ce code avec qui que ce soit.</p>
            </div>
            
            <div class="message">
                <p>Si vous rencontrez des difficultés, n'hésitez pas à contacter notre équipe de support.</p>
            </div>
        </div>
        
        <div class="footer">
            <p><strong>EasyAds</strong> - La plateforme d'annonces préférée</p>
            <p>📧 support@easyads.com | 📱 +216 XX XXX XXX</p>
            <p style="margin-top: 15px; font-size: 12px; color: #999;">
                Cet email a été envoyé automatiquement, merci de ne pas y répondre.
            </p>
        </div>
    </div>
</body>
</html>

