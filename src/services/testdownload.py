import psycopg2

# Database connection details
rds_host = "ll-api-test.c9aa448iernk.ap-southeast-1.rds.amazonaws.com"
rds_user = "postgres"
rds_password = "H%885354312933az"
rds_database = "postgres"

# File path of the PDF to upload
input_file = "/Users/dinesh/Downloads/coalreport_October2024.pdf"  # Update with your path
try:
    # Read the PDF file as binary
    with open(input_file, "rb") as f:
        binary_data = f.read()

    # Connect to the database
    conn = psycopg2.connect(
        host=rds_host,
        user=rds_user,
        password=rds_password,
        database=rds_database
    )
    cur = conn.cursor()

    # Insert or update the binary data into the database
    cur.execute(
        """
        UPDATE coal_reports
        SET file_data = %s
        WHERE id = 1;
        """,
        (binary_data,)
    )
    conn.commit()
    print("PDF successfully uploaded to the database.")

    cur.close()
    conn.close()

except Exception as e:
    print(f"Error: {e}")
