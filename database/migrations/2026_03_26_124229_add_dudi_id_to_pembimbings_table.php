<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('pembimbings', function (Blueprint $table) {
            $table->foreignId('dudi_id')->nullable()->after('department')->constrained()->nullOnDelete();
        });
    }

    public function down(): void
    {
        Schema::table('pembimbings', function (Blueprint $table) {
            $table->dropForeign(['dudi_id']);
            $table->dropColumn('dudi_id');
        });
    }
};
