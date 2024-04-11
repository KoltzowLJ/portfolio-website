<?php
require_once 'db_config.php'; // Update this with the actual path to your config file

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $recaptcha_secret = 'PRIVATE_KEY_HERE'; // Use your secret key
    $recaptcha_response = isset($_POST['g-recaptcha-response']) ? $_POST['g-recaptcha-response'] : null;

    if ($recaptcha_response) {
        // Initialize cURL session
        $ch = curl_init();

        // Set cURL options
        curl_setopt($ch, CURLOPT_URL, "https://www.google.com/recaptcha/api/siteverify");
        curl_setopt($ch, CURLOPT_POST, true);
        curl_setopt($ch, CURLOPT_POSTFIELDS, http_build_query(array(
            'secret' => $recaptcha_secret,
            'response' => $recaptcha_response
        )));
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);

        // Execute cURL session and fetch response
        $response = curl_exec($ch);
        $response_keys = json_decode($response, true);

        // Close cURL session
        curl_close($ch);

        if ($response_keys["success"]) {
            // Database and email operations...
            try {
                $conn = new mysqli(DB_SERVER, DB_USERNAME, DB_PASSWORD, DB_NAME);
                if ($conn->connect_error) {
                    throw new Exception("Connection failed: " . $conn->connect_error);
                }

                $name = $conn->real_escape_string($_POST['name']);
                $email = $conn->real_escape_string($_POST['email']);
                $message = $conn->real_escape_string($_POST['message']);

                $sql = $conn->prepare("INSERT INTO messages (name, email, message) VALUES (?, ?, ?)");
                if (!$sql) {
                    throw new Exception("Prepare statement failed: " . $conn->error);
                }
                $sql->bind_param("sss", $name, $email, $message);
                if (!$sql->execute()) {
                    throw new Exception("Execute failed: " . $sql->error);
                }

                // Auto-response email
                $autoResponseSubject = "Thank You for Contacting Us";
                $autoResponseMessage = "Hello $name,\n\nThank you for reaching out! We have received your message and will get back to you soon.";
                $autoResponseHeaders = "From: no-reply@thesimpleprogrammer.com\r\n";
                mail($email, $autoResponseSubject, $autoResponseMessage, $autoResponseHeaders);

                // Email to site owner
                $yourEmail = 'louwrens@thesimpleprogrammer.com';
                $formDetailsSubject = 'New Contact Form Submission';
                $formDetailsMessage = "You have received a new message from the contact form.\n\nName: $name\nEmail: $email\nMessage: $message";
                $formDetailsHeaders = "From: no-reply@thesimpleprogrammer.com\r\n";
                mail($yourEmail, $formDetailsSubject, $formDetailsMessage, $formDetailsHeaders);

                header("Location: /thank-you.html");
                exit();
            } catch (Exception $e) {
                error_log($e->getMessage());
                header("Location: /error.html");
                exit();
            } finally {
                if (isset($sql) && $sql) $sql->close();
                if ($conn) $conn->close();
            }
        } else {
            header('Location: /error.html');
            exit();
        }
    } else {
        header('Location: /error.html');
        exit();
    }
}
?>
