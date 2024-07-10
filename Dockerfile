FROM postgres

ENV POSTGRES_PASSWORD=new_password

ENV POSTGRES_USER=new_user

ENV POSTGRES_DB=new_database

# Create the user and database on container startup
RUN psql -c "CREATE USER $POSTGRES_USER WITH PASSWORD '$POSTGRES_PASSWORD'; CREATE DATABASE $POSTGRES_DB; GRANT ALL PRIVILEGES ON DATABASE $POSTGRES_DB TO $POSTGRES_USER;"

# Mount the data volume
VOLUME /var/lib/postgresql/data

# Expose the port
EXPOSE 5432