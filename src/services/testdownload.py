import psycopg2

rds_host = "ll-api-test.c9aa448iernk.ap-southeast-1.rds.amazonaws.com"
rds_user = "postgres"
rds_password = "H%885354312933az"
rds_database = "postgres"

input_file = "/Users/dinesh/Downloads/coalreport_October2024.pdf"  # Update with your path
try:
    with open(input_file, "rb") as f:
        binary_data = f.read()

    conn = psycopg2.connect(
        host=rds_host,
        user=rds_user,
        password=rds_password,
        database=rds_database
    )
    cur = conn.cursor()

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
